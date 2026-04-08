'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const clientToken = localStorage.getItem('client_token');
    const adminToken = localStorage.getItem('admin_token');

    const timer = setTimeout(() => {
      if (clientToken) {
        router.replace('/home');
        return;
      }

      if (adminToken) {
        router.replace('/dashboard');
        return;
      }

      router.replace('/login');
    }, 0);

    return () => clearTimeout(timer);
  }, [ready, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
      Loading...
    </div>
  );
}