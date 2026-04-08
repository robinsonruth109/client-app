'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type Wallet = {
  id: number;
  name: string;
  address: string;
  currency: string;
  network: string;
  isActive: boolean;
  createdAt: string;
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    address: '',
    currency: 'USDT',
    network: 'TRC20',
    isActive: true,
  });

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wallets');
      setWallets(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [target.name]:
        target.type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.post('/wallets', form);

      setForm({
        name: '',
        address: '',
        currency: 'USDT',
        network: 'TRC20',
        isActive: true,
      });

      await fetchWallets();
      alert('Wallet created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create wallet');
    } finally {
      setSaving(false);
    }
  };

  const toggleWalletStatus = async (wallet: Wallet) => {
    try {
      setUpdatingId(wallet.id);

      await api.patch(`/wallets/${wallet.id}`, {
        isActive: !wallet.isActive,
      });

      await fetchWallets();
    } catch (error) {
      console.error(error);
      alert('Failed to update wallet');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteWallet = async (walletId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this wallet?');

    if (!confirmed) return;

    try {
      setUpdatingId(walletId);

      await api.delete(`/wallets/${walletId}`);
      await fetchWallets();
    } catch (error) {
      console.error(error);
      alert('Failed to delete wallet');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-semibold">Wallet Management</h1>
        <p className="text-sm text-gray-500">
          Add and manage company deposit wallets
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Add New Wallet</h2>

        <form onSubmit={handleCreateWallet} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Wallet Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Company Wallet 1"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Wallet Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="TRON / USDT address"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="USDT">USDT</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Network
            </label>
            <select
              name="network"
              value={form.network}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="TRC20">TRC20</option>
              <option value="ERC20">ERC20</option>
              <option value="BEP20">BEP20</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 text-gray-800">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Active wallet</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800"
            >
              {saving ? 'Saving...' : 'Add Wallet'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Wallet List</h2>

        {loading ? (
          <p className="text-gray-600">Loading wallets...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm text-gray-800">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Currency</th>
                  <th>Network</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet.id} className="border-b">
                    <td className="py-3">{wallet.id}</td>
                    <td>{wallet.name}</td>
                    <td className="max-w-[260px] truncate">{wallet.address}</td>
                    <td>{wallet.currency}</td>
                    <td>{wallet.network}</td>
                    <td>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          wallet.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(wallet.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleWalletStatus(wallet)}
                          disabled={updatingId === wallet.id}
                          className={`rounded px-3 py-1 text-sm ${
                            wallet.isActive
                              ? 'bg-yellow-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {wallet.isActive ? 'Disable' : 'Enable'}
                        </button>

                        <button
                          onClick={() => deleteWallet(wallet.id)}
                          disabled={updatingId === wallet.id}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {wallets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-500">
                      No wallets found
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}