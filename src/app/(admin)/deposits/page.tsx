'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type Deposit = {
  id: number;
  clientId: number;
  amount: number;
  confirmationAmount?: number | null;
  status: string;
  walletName?: string;
  walletAddress?: string;
  currency?: string;
  network?: string;
  createdAt: string;
  client?: {
    id: number;
    username: string;
    balance: number;
  };
};

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [confirmationAmounts, setConfirmationAmounts] = useState<
    Record<number, string>
  >({});

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deposits');
      const rows = res.data as Deposit[];
      setDeposits(rows);

      const nextConfirmationAmounts: Record<number, string> = {};
      rows.forEach((deposit) => {
        nextConfirmationAmounts[deposit.id] =
          deposit.confirmationAmount !== null &&
          deposit.confirmationAmount !== undefined
            ? String(deposit.confirmationAmount)
            : '';
      });
      setConfirmationAmounts(nextConfirmationAmounts);
    } catch (error: any) {
      console.error(error?.response?.data || error);
      alert(error?.response?.data?.message || 'Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleConfirmationChange = (depositId: number, value: string) => {
    setConfirmationAmounts((prev) => ({
      ...prev,
      [depositId]: value,
    }));
  };

  const updateDepositStatus = async (
    depositId: number,
    status: 'approved' | 'rejected',
  ) => {
    try {
      setUpdatingId(depositId);

      if (status === 'approved') {
        const rawValue = confirmationAmounts[depositId] ?? '';
        const confirmationAmount = Number(rawValue);

        if (
          rawValue.trim() === '' ||
          Number.isNaN(confirmationAmount) ||
          confirmationAmount < 0
        ) {
          alert('Please enter a valid confirmation amount');
          return;
        }

        await api.patch(`/deposits/${depositId}/status`, {
          status,
          confirmationAmount,
        });
      } else {
        await api.patch(`/deposits/${depositId}/status`, {
          status,
        });
      }

      await fetchDeposits();
    } catch (error: any) {
      console.error(error?.response?.data || error);
      alert(error?.response?.data?.message || 'Failed to update deposit status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-semibold">Deposit Management</h1>
        <p className="text-sm text-gray-500">
          Review and approve client deposit requests
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        {loading ? (
          <p className="text-gray-600">Loading deposits...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] text-sm text-gray-800">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">ID</th>
                  <th>Client</th>
                  <th>Requested Amount</th>
                  <th>Status</th>
                  <th>Wallet Name</th>
                  <th>Wallet Address</th>
                  <th>Currency</th>
                  <th>Network</th>
                  <th>Date</th>
                  <th>Confirmation Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b">
                    <td className="py-3">{deposit.id}</td>
                    <td>{deposit.client?.username || `Client #${deposit.clientId}`}</td>
                    <td>{deposit.amount}</td>
                    <td>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          deposit.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : deposit.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </td>
                    <td>{deposit.walletName || '-'}</td>
                    <td className="max-w-[260px] truncate">
                      {deposit.walletAddress || '-'}
                    </td>
                    <td>{deposit.currency || '-'}</td>
                    <td>{deposit.network || '-'}</td>
                    <td>{new Date(deposit.createdAt).toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={confirmationAmounts[deposit.id] ?? ''}
                        onChange={(e) =>
                          handleConfirmationChange(deposit.id, e.target.value)
                        }
                        disabled={deposit.status === 'approved'}
                        className="w-32 rounded border border-gray-300 px-2 py-1 outline-none focus:border-black disabled:bg-gray-100"
                        placeholder="Enter amount"
                      />
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          disabled={
                            updatingId === deposit.id ||
                            deposit.status === 'approved'
                          }
                          onClick={() =>
                            updateDepositStatus(deposit.id, 'approved')
                          }
                          className="rounded bg-green-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={
                            updatingId === deposit.id ||
                            deposit.status === 'rejected'
                          }
                          onClick={() =>
                            updateDepositStatus(deposit.id, 'rejected')
                          }
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-6 text-center text-gray-500">
                      No deposits found
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