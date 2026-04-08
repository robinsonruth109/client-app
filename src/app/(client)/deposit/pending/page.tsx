'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type PendingDeposit = {
  id: number;
  clientId: number;
  amount: number;
  status: string;
  walletName?: string;
  walletAddress?: string;
  currency?: string;
  network?: string;
  createdAt?: string;
};

function buildQrUrl(address: string, amount: number) {
  const encoded = encodeURIComponent(`${address}|${amount}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`;
}

export default function DepositPendingPage() {
  const router = useRouter();
  const [deposit, setDeposit] = useState<PendingDeposit | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('pending_deposit');

    if (!raw) {
      router.replace('/deposit');
      return;
    }

    try {
      setDeposit(JSON.parse(raw));
    } catch (error) {
      console.error(error);
      router.replace('/deposit');
    }
  }, [router]);

  const qrUrl = useMemo(() => {
    if (!deposit?.walletAddress || !deposit?.amount) return '';
    return buildQrUrl(deposit.walletAddress, deposit.amount);
  }, [deposit]);

  const handleCopyAddress = async () => {
    if (!deposit?.walletAddress) return;

    try {
      await navigator.clipboard.writeText(deposit.walletAddress);
      alert('Wallet address copied');
    } catch (error) {
      console.error(error);
      alert('Failed to copy address');
    }
  };

  if (!deposit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-2xl text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Deposit
        </h1>
        <div className="w-8" />
      </div>

      <div className="mx-3 mt-3 rounded-2xl bg-white p-5 text-center shadow-sm">
        <p className="text-4xl font-bold text-gray-900">{deposit.amount}</p>
        <p className="mt-2 text-lg text-gray-700">
          Network - {deposit.network || 'TRC-20'}
        </p>

        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-lg text-red-500">
          ⚠ You have an order that has not been paid
        </div>

        <p className="mt-5 text-lg text-[#ff7a00]">One Time Address:</p>

        <div className="mt-4 flex justify-center">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="Deposit QR"
              className="h-[220px] w-[220px]"
            />
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <p className="max-w-[260px] break-all text-lg text-gray-900">
            {deposit.walletAddress}
          </p>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="text-xl text-gray-700"
          >
            ⧉
          </button>
        </div>

        <p className="mt-5 text-3xl text-gray-900">Waiting for payment...</p>

        <div className="mt-8 text-left text-base text-gray-700">
          <p className="mb-3 font-semibold">Tips:</p>
          <ol className="space-y-2">
            <li>
              1. The recharge address is a <span className="text-red-500">one-time address</span>, please do not leave it or transfer it repeatedly.
            </li>
            <li>
              2. The minimum recharge amount is subject to the actual transfer amount, not less than <span className="text-red-500">10 USDT</span>.
            </li>
            <li>
              3. After recharging, it will take about <span className="text-red-500">1 to 2 minutes</span> to confirm the payment. Please wait patiently.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}