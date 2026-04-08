'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    label: 'Home',
    href: '/home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M3 10L12 3L21 10V21H3V10Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Service',
    href: '/service',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 1V5M12 19V23M4.2 4.2L7 7M17 17L19.8 19.8M1 12H5M19 12H23M4.2 19.8L7 17M17 7L19.8 4.2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Menu',
    href: '/menu',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Record',
    href: '/record',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Mine',
    href: '/mine',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-md items-center justify-between px-1 py-1.5">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-[60px] flex-col items-center justify-center py-1"
            >
              <div
                className={`flex items-center justify-center ${
                  active ? 'text-[#7a4d4d]' : 'text-gray-400'
                }`}
              >
                {item.icon}
              </div>

              <span
                className={`mt-[2px] text-[11px] font-normal ${
                  active ? 'text-[#7a4d4d]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
