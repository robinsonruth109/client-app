'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('client_token');

    const timer = setTimeout(() => {
      if (!token) {
        router.replace('/login');
        return;
      }

      setChecked(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
