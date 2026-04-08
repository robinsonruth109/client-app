'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function RegisterPage() {
  const router = useRouter();
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

  // ✅ FIX: get code from URL WITHOUT useSearchParams
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code') || '';

    if (code) {
      setForm((prev) => ({
        ...prev,
        invitationCode: code,
      }));
    }
  }, []);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setForm((prev) => ({ ...prev, code: '' }));
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

      if (form.code.toUpperCase() !== captcha) {
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
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
            required
          />

          <input
            name="invitationCode"
            placeholder="Invitation Code"
            value={form.invitationCode}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
            required
          />

          <div className="flex gap-2">
            <input
              name="code"
              placeholder="Code"
              value={form.code}
              onChange={handleChange}
              className="flex-1 rounded-xl border px-4 py-3"
            />
            <button
              type="button"
              onClick={refreshCaptcha}
              className="px-4 bg-black text-white rounded-xl"
            >
              {captcha}
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7a4d4d] text-white py-3 rounded-xl"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}