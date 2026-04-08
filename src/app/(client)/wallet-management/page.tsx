'use client';

import { useEffect, useState } from 'react';
import clientApi from '@/lib/client-api';

type ClientWallet = {
  address: string;
  network: string;
  walletName: string;
};

export default function WalletManagementPage() {
  const [wallet, setWallet] = useState<ClientWallet | null>(null);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [newWallet, setNewWallet] = useState({
    address: '',
    network: 'TRC20',
    walletName: 'USDT',
  });

  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientApi.get('/wallets/client');
        setWallet(res.data.wallet || null);
        setHasPassword(res.data.hasPassword || false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSetPassword = async () => {
    if (!withdrawPassword) {
      alert('Enter withdrawal password');
      return;
    }

    try {
      await clientApi.post('/wallets/set-password', {
        password: withdrawPassword,
      });

      alert('Password set successfully');
      setHasPassword(true);
      setWithdrawPassword('');
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to set password');
    }
  };

  const handleAddWallet = async () => {
    if (!newWallet.address) {
      alert('Enter wallet address');
      return;
    }

    try {
      const res = await clientApi.post('/wallets/client', {
        address: newWallet.address,
        network: newWallet.network,
        walletName: newWallet.walletName,
      });

      setWallet(res.data.wallet);
      setNewWallet({
        address: '',
        network: 'TRC20',
        walletName: 'USDT',
      });

      alert('Wallet saved');
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to save wallet');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="flex items-center gap-3 border-b bg-white px-4 py-4">
        <button onClick={() => window.history.back()} className="text-2xl">
          ←
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold">
          Wallet Management
        </h1>
        <div className="w-6" />
      </div>

      {!hasPassword && (
        <div className="mt-3 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">
            Set Withdrawal Password
          </h2>

          <input
            type="password"
            placeholder="Enter password"
            value={withdrawPassword}
            onChange={(e) => setWithdrawPassword(e.target.value)}
            className="w-full rounded border px-3 py-3"
          />

          <button
            onClick={handleSetPassword}
            className="mt-3 w-full rounded bg-[#7a4d4d] py-3 text-white"
          >
            Set Password
          </button>
        </div>
      )}

      {hasPassword && !wallet && (
        <div className="mt-3 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Add Wallet</h2>

          <input
            placeholder="Wallet Address"
            value={newWallet.address}
            onChange={(e) =>
              setNewWallet((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
            className="mb-3 w-full rounded border px-3 py-3"
          />

          <select
            value={newWallet.network}
            onChange={(e) =>
              setNewWallet((prev) => ({
                ...prev,
                network: e.target.value,
              }))
            }
            className="mb-3 w-full rounded border px-3 py-3"
          >
            <option value="TRC20">TRC20</option>
            <option value="ERC20">ERC20</option>
            <option value="BEP20">BEP20</option>
          </select>

          <input
            placeholder="Wallet Name"
            value={newWallet.walletName}
            onChange={(e) =>
              setNewWallet((prev) => ({
                ...prev,
                walletName: e.target.value,
              }))
            }
            className="mb-3 w-full rounded border px-3 py-3"
          />

          <button
            onClick={handleAddWallet}
            className="w-full rounded bg-[#7a4d4d] py-3 text-white"
          >
            Save Wallet
          </button>
        </div>
      )}

      <div className="mt-3 px-3">
        <div className="rounded bg-white p-3">
          <h2 className="mb-3 text-lg font-semibold">My Wallet</h2>

          {!wallet ? (
            <p className="text-gray-500">No wallet added</p>
          ) : (
            <div className="rounded border p-3">
              <p className="font-medium">{wallet.walletName}</p>
              <p className="text-sm text-gray-600">{wallet.network}</p>
              <p className="break-all text-sm text-gray-600">
                {wallet.address}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}