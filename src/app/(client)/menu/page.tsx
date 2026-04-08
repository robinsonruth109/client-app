'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import clientApi from '@/lib/client-api';

type SettingsData = {
  vip1MinBalance: number;
  vip1MaxBalance: number;
  vip2MinBalance: number;
  vip2MaxBalance: number;
  vip3MinBalance: number;
  vip1Commission: number;
  vip2Commission: number;
  vip3Commission: number;
};

const menuItems = [
  {
    vip: 1,
    title: 'Amazon',
    slug: 'Amazon',
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    badge: 'VIP1',
  },
  {
    vip: 2,
    title: 'Alibaba',
    slug: 'Alibaba',
    logo:
      'https://www.vectorlogo.zone/logos/alibabagroup/alibabagroup-icon.svg',
    badge: 'VIP2',
  },
  {
    vip: 3,
    title: 'Aliexpress',
    slug: 'Aliexpress',
    logo:
      'https://www.vectorlogo.zone/logos/aliexpress/aliexpress-icon.svg',
    badge: 'VIP3',
  },
];

export default function MenuPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 1 | 2 | 3>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await clientApi.get('/settings/public');
        setSettings(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const getBalanceText = (vip: number) => {
    if (!settings) return '';

    if (vip === 1) {
      return `${settings.vip1MinBalance}USDT-${settings.vip1MaxBalance} USDT`;
    }

    if (vip === 2) {
      return `${settings.vip2MinBalance}USDT-${settings.vip2MaxBalance} USDT`;
    }

    return `≥${settings.vip3MinBalance} USDT`;
  };

  const getCommissionText = (vip: number) => {
    if (!settings) return '';

    if (vip === 1) return `${settings.vip1Commission * 100}%`;
    if (vip === 2) return `${settings.vip2Commission * 100}%`;
    return `${settings.vip3Commission * 100}%`;
  };

  const filteredItems =
    activeTab === 'all'
      ? menuItems
      : menuItems.filter((item) => item.vip === activeTab);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-6">
      <div className="bg-[#f3f3f3] px-2 pt-3">
        <h1 className="mb-4 text-center text-2xl font-semibold text-gray-900">
          Menu
        </h1>

        <div className="mb-4 grid grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-md py-3 text-lg ${
              activeTab === 'all'
                ? 'bg-[#7a5a61] text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`rounded-md py-3 text-lg ${
              activeTab === 1
                ? 'bg-[#7a5a61] text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            VIP 1
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`rounded-md py-3 text-lg ${
              activeTab === 2
                ? 'bg-[#7a5a61] text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            VIP 2
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`rounded-md py-3 text-lg ${
              activeTab === 3
                ? 'bg-[#7a5a61] text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            VIP 3
          </button>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Link
              key={item.slug}
              href={`/menu/${encodeURIComponent(item.slug)}`}
              className="block bg-white p-3"
            >
              <div className="mb-2 inline-block rounded bg-[#f5b71d] px-2 py-0.5 text-xs font-semibold text-white">
                {item.badge}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-white">
                  <img
                    src={item.logo}
                    alt={item.title}
                    className="max-h-16 max-w-16 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-medium text-gray-900">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Available balance: {getBalanceText(item.vip)}
                  </p>
                  <p className="mt-2 text-sm text-[#6d88c7]">
                    Commissions:{' '}
                    <span className="text-[#d4584e]">
                      {getCommissionText(item.vip)}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="py-8 text-center text-2xl text-gray-400">No more</p>
      </div>
    </div>
  );
}