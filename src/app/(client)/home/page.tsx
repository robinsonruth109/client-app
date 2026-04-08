'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clientApi from '@/lib/client-api';

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
};

const cards = [
  {
    title: 'Platform profile',
    description: 'MALL is an intelligent cloud global order matching cente...',
    href: '/platform/profile',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Platform rules',
    description: 'About recharge: [The platform will change the recharge...',
    href: '/platform/rules',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Win-win cooperation',
    description: 'At MALL, we carry out win-win cooperation for all user...',
    href: '/platform/cooperation',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Instructions for use',
    description: 'To celebrate the MALL membership surpassing ...',
    href: '/platform/instructions',
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
  },
];

export default function ClientHomePage() {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-6">
      {/* HEADER */}
      <div className="border-b border-gray-200 bg-white px-3 pb-4 pt-3">
        <div className="mb-4 flex items-center">
          {/* ✅ LOGO UPDATED */}
          <img
            src="/logo.png"   // ← put your image inside /public/logo.png
            alt="logo"
            className="h-[32px] w-[32px] object-contain"
          />
        </div>

        {/* ICON MENU */}
        <div className="grid grid-cols-4 gap-1 text-center">
          <Link href="/deposit" className="flex flex-col items-center">
            <div className="mb-1 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#6f6f78]">
              <span className="text-[18px] text-[#f1625a]">↗</span>
            </div>
            <span className="text-[13px] text-black">Recharge</span>
          </Link>

          <Link href="/withdrawal" className="flex flex-col items-center">
            <div className="mb-1 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#6f6f78]">
              <span className="text-[18px] text-[#4b4b52]">↘</span>
            </div>
            <span className="text-[13px] text-black">Withdrawal</span>
          </Link>

          <Link href="/teams" className="flex flex-col items-center">
            <span className="mb-1 text-[24px] text-[#6c6c74]">👥</span>
            <span className="text-[13px] text-black">Teams</span>
          </Link>

          <Link href="/invite" className="flex flex-col items-center">
            <span className="mb-1 text-[24px] text-[#6c6c74]">➕</span>
            <span className="text-[13px] text-black">Invitation</span>
          </Link>
        </div>
      </div>

      {/* USER STRIP */}
      <div className="mt-2 bg-white px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[22px] text-[#f36b5c]">👤</span>
            <div>
              <p className="text-[13px] text-[#7d7d86]">
                {client?.username || 'Client'}
              </p>
              <p className="mt-1 text-[22px] font-semibold text-[#9b9ba3]">
                successful
              </p>
            </div>
          </div>

          <div className="text-[18px] font-medium text-[#8d8d95]">
            {Number(client?.balance ?? 0).toFixed(2)} USDT
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="px-2 pt-3">
        <h2 className="mb-3 px-1 text-[18px] font-semibold text-black">
          Platform introduction
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="overflow-hidden bg-white"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-[132px] w-full object-cover"
              />
              <div className="px-2 pb-2 pt-1">
                <p className="text-[12px] font-medium text-black">
                  {card.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] text-[#8f8f98]">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}