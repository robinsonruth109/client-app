'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ServicePage() {
  const [telegramLink, setTelegramLink] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:3001/settings/public');
        const data = await res.json();
        setTelegramLink(data.telegramGroupLink || '');
      } catch (error) {
        console.error(error);
      }
    };

    fetchSettings();
  }, []);

  const handleOpenTelegram = () => {
    if (!telegramLink) {
      alert('Online customer service is not available now');
      return;
    }

    window.open(telegramLink, '_blank');
  };

  const handleOpenHelp = () => {
    window.location.href = '/platform/instructions';
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-6">
      <div className="bg-[#fdf0f0] px-6 pb-6 pt-10">
        <h1 className="text-[26px] font-normal leading-tight text-[#5d4650]">
          Customer Service Center
        </h1>

        <p className="mt-3 text-[15px] text-[#6c5c63]">
          Online customer service time 07:00-23:00（UK）
        </p>

        <div className="mt-8 flex justify-center">
          <Image
            src="/images/customer-service.png"
            alt="Customer service"
            width={320}
            height={260}
            className="h-auto w-full max-w-[320px] object-contain"
            priority
          />
        </div>
      </div>

      <div className="mt-3 space-y-3 px-3">
        <button
          type="button"
          onClick={handleOpenTelegram}
          className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-5 text-left shadow-sm"
        >
          <span className="text-[18px] text-gray-900">
            Online customer service
          </span>
          <span className="text-[28px] leading-none text-gray-500">›</span>
        </button>

        <button
          type="button"
          onClick={handleOpenHelp}
          className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-5 text-left shadow-sm"
        >
          <span className="text-[18px] text-gray-900">Help</span>
          <span className="text-[28px] leading-none text-gray-500">›</span>
        </button>
      </div>
    </div>
  );
}
