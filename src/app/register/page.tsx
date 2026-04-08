'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clientApi from '@/lib/client-api';
import { useClientAuthStore } from '@/store/client-auth-store';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useClientAuthStore();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
    code: '',
  });

  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  useEffect(() => {
    const codeFromUrl = searchParams.get('code') || '';
    if (codeFromUrl) {
      setForm((prev) => ({
        ...prev,
        invitationCode: codeFromUrl,
      }));
    }
  }, [searchParams]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setForm((prev) => ({
      ...prev,
      code: '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (form.code.trim().toUpperCase() !== captcha) {
        setError('Invalid verification code');
        refreshCaptcha();
        setLoading(false);
        return;
      }

      const res = await clientApi.post('/auth/client-register', {
        username: form.username,
        password: form.password,
        invitationCode: form.invitationCode,
      });

      setAuth(res.data.access_token, res.data.client);
      router.push('/home');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-2xl text-gray-700"
          >
            ←
          </button>
          <div />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="username"
            placeholder="6-16 letters or numbers"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-400 px-4 py-4 text-lg outline-none"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="6-16 alphanumeric password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-400 px-4 py-4 text-lg outline-none"
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Please enter the password again"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-400 px-4 py-4 text-lg outline-none"
            required
          />

          <input
            name="invitationCode"
            placeholder="Invitation code (required)"
            value={form.invitationCode}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-400 px-4 py-4 text-lg outline-none"
            required
          />

          <div className="flex gap-3">
            <input
              name="code"
              placeholder="Verification Code"
              value={form.code}
              onChange={handleChange}
              className="flex-1 rounded-xl border border-gray-400 px-4 py-4 text-lg outline-none"
              required
            />

            <button
              type="button"
              onClick={refreshCaptcha}
              className="min-w-[110px] rounded-xl border border-gray-400 bg-black px-3 py-4 text-center text-2xl text-pink-500"
              title="Refresh code"
            >
              {captcha || '----'}
            </button>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7a4d4d] py-4 text-xl text-white"
          >
            {loading ? 'Registering...' : 'Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-700">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}