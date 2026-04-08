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

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useClientAuthStore();

  const [mounted, setMounted] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    username: '',
    password: '',
    code: '',
  });

  useEffect(() => {
    setMounted(true);
    setCaptcha(generateCaptcha());
  }, []);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (form.code.trim().toUpperCase() !== captcha) {
        setError('Invalid verification code');
        refreshCaptcha();
        setLoading(false);
        return;
      }

      const res = await clientApi.post('/auth/client-login', {
        username: form.username,
        password: form.password,
      });

      setAuth(res.data.access_token, res.data.client);
      router.push('/home');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900">
          Hello, Welcome!
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-400 px-4 py-4 text-lg outline-none"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
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
              className="min-w-[110px] rounded-xl border border-gray-400 bg-orange-50 px-3 py-4 text-center text-2xl text-[#7a4d4d]"
              title="Refresh code"
            >
              {captcha}
            </button>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7a4d4d] py-4 text-xl text-white"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button
          onClick={() => router.push('/register')}
          className="mt-5 text-base text-gray-700"
        >
          Registration
        </button>
      </div>
    </div>
  );
}