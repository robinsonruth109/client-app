'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type Withdrawal = {
  id: number;
  clientId: number;
  amount: number;
  fee: number;
  status: string;
  createdAt: string;
  client?: {
    id: number;
    username: string;
    balance: number;
    taxControl?: boolean;
    isFrozen?: boolean;
  };
};

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/withdrawals');
      setWithdrawals(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const updateWithdrawalStatus = async (
    withdrawalId: number,
    status: 'approved' | 'rejected' | 'paid',
  ) => {
    try {
      setUpdatingId(withdrawalId);

      await api.patch(`/withdrawals/${withdrawalId}/status`, {
        status,
      });

      await fetchWithdrawals();
    } catch (error) {
      console.error(error);
      alert('Failed to update withdrawal status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-semibold">Withdrawal Management</h1>
        <p className="text-sm text-gray-500">
          Review, approve, reject, or mark withdrawals as paid
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        {loading ? (
          <p className="text-gray-600">Loading withdrawals...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm text-gray-800">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">ID</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Fee</th>
                  <th>Net</th>
                  <th>Status</th>
                  <th>Client Balance</th>
                  <th>Tax</th>
                  <th>Frozen</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.map((withdrawal) => {
                  const netAmount = Number(
                    (withdrawal.amount - withdrawal.fee).toFixed(2),
                  );

                  return (
                    <tr key={withdrawal.id} className="border-b">
                      <td className="py-3">{withdrawal.id}</td>
                      <td>
                        {withdrawal.client?.username ||
                          `Client #${withdrawal.clientId}`}
                      </td>
                      <td>{withdrawal.amount}</td>
                      <td>{withdrawal.fee}</td>
                      <td>{netAmount}</td>
                      <td>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            withdrawal.status === 'paid'
                              ? 'bg-blue-100 text-blue-700'
                              : withdrawal.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : withdrawal.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                      </td>
                      <td>{withdrawal.client?.balance ?? '-'}</td>
                      <td>
                        {withdrawal.client?.taxControl ? 'Enabled' : 'Off'}
                      </td>
                      <td>{withdrawal.client?.isFrozen ? 'Yes' : 'No'}</td>
                      <td>{new Date(withdrawal.createdAt).toLocaleString()}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            disabled={
                              updatingId === withdrawal.id ||
                              withdrawal.status === 'approved' ||
                              withdrawal.status === 'paid'
                            }
                            onClick={() =>
                              updateWithdrawalStatus(withdrawal.id, 'approved')
                            }
                            className="rounded bg-green-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            disabled={
                              updatingId === withdrawal.id ||
                              withdrawal.status === 'rejected'
                            }
                            onClick={() =>
                              updateWithdrawalStatus(withdrawal.id, 'rejected')
                            }
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                          >
                            Reject
                          </button>

                          <button
                            disabled={
                              updatingId === withdrawal.id ||
                              withdrawal.status !== 'approved'
                            }
                            onClick={() =>
                              updateWithdrawalStatus(withdrawal.id, 'paid')
                            }
                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-6 text-center text-gray-500">
                      No withdrawals found
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