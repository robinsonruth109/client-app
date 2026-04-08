'use client';

import Image from 'next/image';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-6">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-2xl text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-[28px] font-semibold text-gray-900">
          Instructions for use
        </h1>
        <div className="w-8" />
      </div>

      <div className="bg-white px-4 py-5">
        <h2 className="text-[20px] font-medium text-gray-900">Deposit FAQ</h2>

        <p className="mt-4 text-[18px] leading-8 text-gray-900">
          1. The payment address is a one-time address. Users need to obtain a
          new payment address each time they make a deposit. Repeated deposits
          to the same payment address are not allowed.
        </p>

        <div className="mt-5 overflow-hidden rounded-sm">
          <Image
            src="/images/instructions-banner.png"
            alt="Instructions banner"
            width={800}
            height={450}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl">👥</span>
            <span className="mt-2 text-[16px] leading-5 text-gray-800">
              Teams
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl">🧾</span>
            <span className="mt-2 text-[16px] leading-5 text-gray-800">
              Record
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl">📈</span>
            <span className="mt-2 text-[16px] leading-5 text-gray-800">
              Wallet
              <br />
              management
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl">✉️</span>
            <span className="mt-2 text-[16px] leading-5 text-gray-800">
              Invite friends
            </span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-[#f8f8f8]">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5">
            <span className="text-[18px] text-gray-800">Profile</span>
            <span className="text-[28px] leading-none text-gray-400">›</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5">
            <span className="text-[18px] text-gray-800">Deposit records</span>
            <span className="text-[28px] leading-none text-gray-400">›</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5">
            <span className="text-[18px] text-gray-800">Withdrawal records</span>
            <span className="text-[28px] leading-none text-gray-400">›</span>
          </div>

          <div className="flex items-center justify-between px-4 py-5">
            <span className="text-[18px] text-gray-800">Setting</span>
            <span className="text-[28px] leading-none text-gray-400">›</span>
          </div>
        </div>
      </div>
    </div>
  );
}