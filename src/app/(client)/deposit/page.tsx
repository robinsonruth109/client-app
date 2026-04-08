'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clientApi from '@/lib/client-api';

type ClientMe = {
  id: number;
};

export default function DepositPage() {
  const router = useRouter();

  const [clientId, setClientId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'error' | 'success'>('error');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await clientApi.get('/auth/client-me');
        const me = res.data as ClientMe;
        setClientId(me.id);
      } catch (error) {
        console.error(error);
        setPopupType('error');
        setPopupMessage('Failed to load client info');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleDeposit = async () => {
    if (!clientId) return;

    const parsedAmount = Number(amount);

    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setPopupType('error');
      setPopupMessage('Please enter a valid deposit amount');
      return;
    }

    try {
      setSubmitting(true);

      const res = await clientApi.post('/deposits', {
        clientId,
        amount: parsedAmount,
      });

      const deposit = res.data;

      sessionStorage.setItem('pending_deposit', JSON.stringify(deposit));
      router.push('/deposit/pending');
    } catch (error: any) {
      console.error(error);
      setPopupType('error');
      setPopupMessage(error?.response?.data?.message || 'Failed to create deposit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center border-b border-[#ececec] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-[24px] leading-none text-[#333]"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-[18px] font-semibold text-[#111]">
          Deposit
        </h1>
        <div className="w-6" />
      </div>

      <div className="space-y-[10px] pb-6">
        <div className="bg-white px-[14px] py-[12px]">
          <div className="mb-3 text-[14px] font-semibold tracking-[2px] text-[#222]">
            Payment method
          </div>

          <div className="relative inline-flex h-[56px] w-[68px] flex-col items-center justify-center rounded-[4px] border border-[#8c7278] bg-white">
            <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#42b6ff] text-[12px] text-white">
              💠
            </div>
            <span className="mt-[4px] text-[12px] leading-none text-[#555]">
              USDT
            </span>
            <span className="absolute bottom-0 right-0 text-[12px] leading-none text-red-600">
              ◢
            </span>
          </div>
        </div>

        <div className="bg-white px-[14px] py-[12px]">
          <div className="mb-3 text-[14px] font-semibold tracking-[2px] text-[#222]">
            Select the protocol to use
          </div>

          <div className="relative inline-flex h-[40px] min-w-[60px] items-center justify-center rounded-[4px] border border-[#8c7278] bg-white px-4 text-[12px] text-[#555]">
            TRC-20
            <span className="absolute bottom-0 right-0 text-[12px] leading-none text-red-600">
              ◢
            </span>
          </div>
        </div>

        <div className="bg-white px-[14px] py-[12px]">
          <div className="mb-3 text-[14px] font-semibold tracking-[2px] text-[#222]">
            Currency selection
          </div>

          <div className="relative inline-flex h-[40px] min-w-[44px] items-center justify-center rounded-[4px] border border-[#8c7278] bg-white px-4 text-[12px] text-[#555]">
            ALL
            <span className="absolute bottom-0 right-0 text-[12px] leading-none text-red-600">
              ◢
            </span>
          </div>
        </div>

        <div className="bg-white">
          <div className="border-b border-[#eeeeee] px-[14px] py-[12px]">
            <div className="text-[14px] font-semibold tracking-[2px] text-[#222]">
              Deposit amount
            </div>
          </div>

          <div className="px-[14px] py-[12px]">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[18px] font-medium text-[#333]">USDT</span>
              <span className="text-[12px] text-[#bcbcbc]">
                Deposit amount must be greater than 0.1 USDT
              </span>
            </div>

            <input
              type="number"
              step="0.01"
              placeholder=""
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-[20px] text-[#222] outline-none placeholder:text-[#c8c8c8]"
            />
          </div>

          <div className="border-t border-[#eeeeee] px-[14px] py-[12px] text-[12px] text-[#666]">
            <p>
              Estimated payment:&nbsp;
              <span className="font-medium text-[#333]">{amount || '0'}USDT</span>
            </p>

            <p className="mt-3">Reference rate: 1 USDT ≈ 1 USDT</p>

            <p className="mt-1 leading-5 text-[#8d8d8d]">
              The payment amount and exchange rate are subject to the actual
              payment.
            </p>
          </div>
        </div>

        <div className="px-[14px] pt-[8px]">
          <button
            type="button"
            onClick={handleDeposit}
            disabled={submitting}
            className="w-full rounded-[4px] bg-[#b39ea2] py-[12px] text-[17px] font-semibold text-white disabled:opacity-80"
          >
            {submitting ? 'Submitting...' : 'Deposit now'}
          </button>
        </div>
      </div>

      {popupMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <p
              className={`text-base font-medium ${
                popupType === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {popupMessage}
            </p>

            <button
              type="button"
              onClick={() => setPopupMessage('')}
              className="mt-4 rounded-xl bg-black px-5 py-2 text-sm text-white"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}