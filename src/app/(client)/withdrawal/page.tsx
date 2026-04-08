'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clientApi from '@/lib/client-api';

type ClientMe = {
  id: number;
  username: string;
  balance: number;
};

type WalletResponse = {
  hasPassword: boolean;
  wallet: {
    address: string;
    network: string;
    walletName: string;
  } | null;
};

export default function WithdrawalPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [client, setClient] = useState<ClientMe | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletResponse | null>(null);

  const [amount, setAmount] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');

  const [showNoPasswordPopup, setShowNoPasswordPopup] = useState(false);
  const [showNoWalletPopup, setShowNoWalletPopup] = useState(false);

  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  const feeRate = 0.05;

  const fee = useMemo(() => {
    const parsed = Number(amount || 0);
    if (!parsed || Number.isNaN(parsed)) return 0;
    return Number((parsed * feeRate).toFixed(2));
  }, [amount]);

  const netAmount = useMemo(() => {
    const parsed = Number(amount || 0);
    if (!parsed || Number.isNaN(parsed)) return 0;
    return Number((parsed - fee).toFixed(2));
  }, [amount, fee]);

  const showPopup = (message: string, type: 'success' | 'error') => {
    setPopupMessage(message);
    setPopupType(type);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [meRes, walletRes] = await Promise.all([
        clientApi.get('/auth/client-me'),
        clientApi.get('/wallets/client'),
      ]);

      const me = meRes.data as ClientMe;
      const wallet = walletRes.data as WalletResponse;

      setClient(me);
      setWalletInfo(wallet);

      if (!wallet.hasPassword) {
        setShowNoPasswordPopup(true);
      } else if (!wallet.wallet) {
        setShowNoWalletPopup(true);
      }
    } catch (error) {
      console.error(error);
      showPopup('Failed to load withdrawal data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitWithdrawal = async () => {
    if (!client) return;

    if (!walletInfo?.hasPassword) {
      setShowNoPasswordPopup(true);
      return;
    }

    if (!walletInfo?.wallet) {
      setShowNoWalletPopup(true);
      return;
    }

    if (!amount || Number(amount) <= 0) {
      showPopup('Enter a valid withdrawal amount', 'error');
      return;
    }

    if (!withdrawPassword) {
      showPopup('Enter withdrawal password', 'error');
      return;
    }

    try {
      setSubmitting(true);

      await clientApi.post('/withdrawals', {
        clientId: client.id,
        amount: Number(amount),
        fee,
        password: withdrawPassword,
      });

      showPopup('Withdrawal request submitted successfully', 'success');

      setAmount('');
      setWithdrawPassword('');

      setTimeout(() => {
        router.push('/withdrawal-records');
      }, 1200);
    } catch (error: any) {
      console.error(error);
      showPopup(
        error?.response?.data?.message || 'Failed to submit withdrawal',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="flex items-center border-b border-[#e7e7e7] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-[24px] leading-none text-[#333]"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-[18px] font-semibold text-[#111]">
          Withdrawal
        </h1>
        <div className="w-6" />
      </div>

      <div className="space-y-[10px]">
        <div className="bg-white px-[14px] py-[12px]">
          <div className="relative inline-flex h-[60px] w-[78px] flex-col items-center justify-center rounded-[4px] border border-[#8c7278] bg-white">
            <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#42b6ff] text-[14px] text-white">
              💠
            </div>
            <span className="mt-[2px] text-center text-[12px] leading-[12px] text-[#444]">
              virtual
              <br />
              currency
            </span>
            <span className="absolute bottom-0 right-0 text-[12px] leading-none text-red-600">
              ✓
            </span>
          </div>
        </div>

        <div className="bg-white">
          <div className="border-b border-[#ededed] px-[14px] py-[14px]">
            <p className="text-[14px] font-semibold text-[#222]">Wallet</p>
          </div>

          {walletInfo?.wallet ? (
            <div className="flex items-center justify-between px-[14px] py-[14px]">
              <div className="flex items-center gap-3">
                <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#42b6ff] text-[12px] text-white">
                  💠
                </div>
                <div className="text-[14px] font-semibold uppercase text-[#444]">
                  {walletInfo.wallet.walletName}({walletInfo.wallet.network})
                </div>
              </div>
              <span className="text-[16px] text-red-600">✔</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/wallet-management')}
              className="w-full px-[14px] py-[16px] text-left text-[14px] text-[#7a4d4d]"
            >
              + Add e-wallet
            </button>
          )}
        </div>

        <div className="bg-white">
          <div className="flex items-center justify-between px-[14px] py-[14px]">
            <span className="text-[14px] font-semibold text-[#222]">USDT</span>
            <span className="text-[13px] text-[#b4b4b4]">
              Balance: {Number(client?.balance ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="border-t border-[#ededed] px-[14px] py-[10px]">
            <input
              type="number"
              step="0.01"
              placeholder=""
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-0 bg-transparent text-[18px] text-[#222] outline-none placeholder:text-[#c7c7c7]"
            />
          </div>
        </div>

        <div className="bg-white">
          <div className="px-[14px] py-[14px]">
            <p className="text-[14px] font-semibold text-[#222]">
              Withdrawal password
            </p>
          </div>
          <div className="border-t border-[#ededed] px-[14px] py-[10px]">
            <input
              type="password"
              placeholder="Please enter your password"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              className="w-full border-0 bg-transparent text-[16px] text-[#222] outline-none placeholder:text-[#c7c7c7]"
            />
          </div>
        </div>

        <div className="px-[14px] pt-[8px]">
          <button
            type="button"
            onClick={handleSubmitWithdrawal}
            disabled={submitting}
            className="w-full rounded-[4px] bg-[#b39ea2] py-[12px] text-[17px] font-semibold text-white disabled:opacity-80"
          >
            {submitting ? 'Submitting...' : 'OK'}
          </button>
        </div>

        {(amount || fee > 0) && (
          <div className="px-[14px] pt-[4px] text-[13px] text-[#666]">
            <p>Fee: {fee.toFixed(2)} USDT</p>
            <p className="mt-1">Net amount: {netAmount.toFixed(2)} USDT</p>
          </div>
        )}
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

      {showNoPasswordPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Withdrawal password
            </h2>
            <p className="mt-4 text-base text-gray-600">
              Sorry! You have not set a withdrawal password.
            </p>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setShowNoPasswordPopup(false)}
                className="flex-1 rounded-xl border border-[#7a4d4d] py-3 text-base text-[#7a4d4d]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => router.push('/wallet-management')}
                className="flex-1 rounded-xl bg-[#7a4d4d] py-3 text-base text-white"
              >
                To set
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showNoWalletPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              No withdrawal wallet
            </h2>
            <p className="mt-4 text-base text-gray-600">
              Please bind an electronic wallet for withdrawal.
            </p>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setShowNoWalletPopup(false)}
                className="flex-1 rounded-xl border border-[#7a4d4d] py-3 text-base text-[#7a4d4d]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => router.push('/wallet-management')}
                className="flex-1 rounded-xl bg-[#7a4d4d] py-3 text-base text-white"
              >
                Add wallet
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}