'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clientApi from '@/lib/client-api';
import { useClientAuthStore } from '@/store/client-auth-store';

type ClientMe = {
  id: number;
  username: string;
  balance: number;
  vipLevel: number;
  todayTaskCount: number;
  dailyTaskLimit: number;
  invitationCode?: string;
  isApproved: boolean;
  isFrozen: boolean;
  canGrabOrders: boolean;
  avatarUrl?: string | null;
};

const quickLinks = [
  { label: 'Teams', href: '/teams', icon: '👥', color: 'text-[#f2a634]' },
  { label: 'Record', href: '/all-records', icon: '🧾', color: 'text-[#52d6a1]' },
  {
    label: 'Wallet\nmanagement',
    href: '/wallet-management',
    icon: '📈',
    color: 'text-[#f25f5c]',
  },
  { label: 'Invite friends', href: '/invite', icon: '✉️', color: 'text-[#5fb0ff]' },
];

const menuLinks = [
  { label: 'Profile', href: '/profile', icon: '🪪' },
  { label: 'Deposit records', href: '/deposit-records', icon: '📄' },
  { label: 'Withdrawal records', href: '/withdrawal-records', icon: '💳' },
  { label: 'Setting', href: '/setting', icon: '⚙️' },
];

export default function MinePage() {
  const { clearAuth } = useClientAuthStore();

  const [client, setClient] = useState<ClientMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await clientApi.get('/auth/client-me');
        setClient(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-6">
      <div className="bg-[linear-gradient(90deg,#a94b57_0%,#7f5a61_100%)] px-4 pb-7 pt-5 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                client?.avatarUrl ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop'
              }
              alt="avatar"
              className="h-[64px] w-[64px] rounded-full object-cover"
            />

            <div className="pt-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[19px] font-bold leading-none">
                  {client?.username || '-'}
                </h1>
                <span className="rounded-sm bg-[#f0b02e] px-1.5 py-[1px] text-[10px] font-semibold leading-none text-white">
                  VIP {client?.vipLevel ?? 1}
                </span>
              </div>

              <p className="mt-3 text-[14px] leading-none text-white">
                Invitation code: {client?.invitationCode || '-'}
              </p>
            </div>
          </div>

          <Link href="/service" className="mt-1 text-[24px] leading-none text-white">
            💬
          </Link>
        </div>

        <div className="mt-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[15px] font-semibold leading-none text-white">
              My Account
            </p>

            <div className="flex items-end gap-2">
              <span className="text-[14px] font-medium leading-none text-white">
                USDT
              </span>
              <span className="text-[18px] font-bold leading-none text-white">
                {Number(client?.balance ?? 0).toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex gap-5">
            <Link href="/deposit" className="flex w-[72px] flex-col items-center text-center">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-white shadow">
                <span className="text-[24px] text-[#2f6ee5]">💼</span>
              </div>
              <span className="mt-1.5 text-[13px] leading-none text-white">
                Deposit
              </span>
            </Link>

            <Link
              href="/withdrawal"
              className="flex w-[78px] flex-col items-center text-center"
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-white shadow">
                <span className="text-[24px] text-[#2f6ee5]">💳</span>
              </div>
              <span className="mt-1.5 text-[13px] leading-none text-white">
                Withdrawal
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white px-3 py-5">
        <div className="grid grid-cols-4 gap-1 text-center">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-start"
            >
              <span className={`mb-2 text-[30px] leading-none ${item.color}`}>
                {item.icon}
              </span>
              <span className="whitespace-pre-line text-[13px] leading-[16px] text-black">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 px-2">
        <div className="rounded-[8px] bg-white px-3 py-2">
          {menuLinks.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between py-4 ${
                index !== menuLinks.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[18px] text-[#a9a9b4]">{item.icon}</span>
                <span className="text-[14px] text-[#222]">{item.label}</span>
              </div>

              <span className="text-[22px] leading-none text-[#b7b7c2]">›</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 px-4">
        <button
          onClick={handleLogout}
          className="hidden w-full rounded-xl border border-red-300 bg-white py-4 text-lg font-medium text-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}