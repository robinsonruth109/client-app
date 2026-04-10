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
    description:
      'MALL is an intelligent cloud global order matching cente...',
    href: '/platform/profile',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Platform rules',
    description:
      'About recharge: [The platform will change the recharge...',
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
    <div className="min-h-screen w-full bg-[#f3f3f3] pb-6">
      {/* HEADER */}
      <div className="w-full border-b border-[#e9e9e9] bg-white">
        <div className="px-3 pb-3 pt-3 md:px-5">
          <img
            src="/logo.png"
            alt="logo"
            className="h-[30px] w-[30px] object-contain md:h-[34px] md:w-[34px]"
          />
        </div>

        {/* ICON MENU */}
        <div className="grid w-full grid-cols-4 border-t border-[#efefef] px-2 py-5 text-center md:px-8 md:py-4">
          <Link href="/deposit" className="flex flex-col items-center">
            <div className="mb-1 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#6f6f78] md:h-[40px] md:w-[40px]">
              <span className="text-[18px] md:text-[20px]">📈</span>
            </div>
            <span className="text-[13px] text-black md:text-[14px]">
              Recharge
            </span>
          </Link>

          <Link href="/withdrawal" className="flex flex-col items-center">
            <div className="mb-1 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#6f6f78] md:h-[40px] md:w-[40px]">
              <span className="text-[18px] md:text-[20px]">📉</span>
            </div>
            <span className="text-[13px] text-black md:text-[14px]">
              Withdrawal
            </span>
          </Link>

          <Link href="/teams" className="flex flex-col items-center">
            <span className="mb-1 text-[24px] text-[#6c6c74] md:text-[30px]">
              👥
            </span>
            <span className="text-[13px] text-black md:text-[14px]">
              Teams
            </span>
          </Link>

          <Link href="/invite" className="flex flex-col items-center">
            <span className="mb-1 text-[24px] text-[#6c6c74] md:text-[30px]">
              ➕
            </span>
            <span className="text-[13px] text-black md:text-[14px]">
              Invitation
            </span>
          </Link>
        </div>
      </div>

      {/* USER STRIP */}
      <div className="mt-[10px] w-full bg-white px-3 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-[22px] text-[#ef675d] md:text-[28px]">👤</span>
            <div className="min-w-0">
              <p className="truncate text-[13px] text-[#6f6f76] md:text-[14px]">
                {client?.username || 'Client'}
              </p>
              <p className="text-[16px] leading-[18px] text-[#9c9ca3] md:text-[18px]">
                successful
              </p>
            </div>
          </div>

          <div className="shrink-0 text-[16px] font-medium text-[#9a9aa1] md:text-[18px]">
            {Number(client?.balance ?? 0).toFixed(2)} USDT
          </div>
        </div>
      </div>

      {/* INTRO */}
      <div className="px-3 pt-3 md:px-3">
        <h2 className="mb-3 text-[18px] font-semibold text-[#222] md:text-[20px]">
          Platform introduction
        </h2>

        {/* mobile */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
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

        {/* desktop exactly like screenshot: 4 cards in one row, left aligned */}
        <div className="hidden md:flex md:flex-row md:gap-[12px]">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="w-[250px] shrink-0 overflow-hidden bg-white"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-[190px] w-full object-cover"
              />
              <div className="px-2 pb-2 pt-2">
                <p className="text-[18px] font-medium leading-[22px] text-black">
                  {card.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[15px] leading-[18px] text-[#8f8f98]">
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

