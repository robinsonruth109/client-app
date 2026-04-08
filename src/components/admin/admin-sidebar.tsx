'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Clients', href: '/clients' },
  { label: 'Admins', href: '/admins' },
  { label: 'Wallets', href: '/wallets' },
  { label: 'Deposits', href: '/deposits' },
  { label: 'Withdrawals', href: '/withdrawals' },
  { label: 'Products', href: '/products' },
  { label: 'Settings', href: '/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 bg-black p-5 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-sm text-gray-400">Control Center</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 transition ${
                active
                  ? 'bg-white font-semibold text-black'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}