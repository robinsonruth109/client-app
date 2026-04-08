'use client';

import { useRouter } from 'next/navigation';
import { useClientAuthStore } from '@/store/client-auth-store';

export default function SettingPage() {
  const router = useRouter();
  const { clearAuth } = useClientAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-2xl text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Setting
        </h1>
        <div className="w-8" />
      </div>

      <div className="mt-3 bg-white">
        <button
          type="button"
          onClick={() => router.push('/setting/language')}
          className="flex w-full items-center justify-between px-4 py-5 text-left"
        >
          <span className="text-xl text-gray-800">Language settings</span>
          <span className="text-2xl text-gray-400">›</span>
        </button>
      </div>

      <div className="mt-8 px-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-center text-xl font-medium text-[#ff5a4f]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}