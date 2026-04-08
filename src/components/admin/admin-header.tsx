'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function AdminHeader() {
  const router = useRouter();
  const { admin, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500">{admin?.username || 'Admin'}</p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-xl bg-black px-4 py-2 text-white"
      >
        Logout
      </button>
    </header>
  );
}