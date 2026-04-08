'use client';

import { useEffect, useState } from 'react';
import clientApi from '@/lib/client-api';

type DepositItem = {
  id: number;
  amount: number;
  confirmationAmount?: number | null;
  status: string;
  walletName?: string | null;
  walletAddress?: string | null;
  currency?: string | null;
  network?: string | null;
  createdAt: string;
};

type ClientMe = {
  id: number;
};

type ClientDetail = {
  id: number;
  deposits: DepositItem[];
};

export default function DepositRecordsPage() {
  const [records, setRecords] = useState<DepositItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const meRes = await clientApi.get('/auth/client-me');
        const me = meRes.data as ClientMe;

        const detailRes = await clientApi.get(`/clients/${me.id}`);
        const detail = detailRes.data as ClientDetail;

        const sorted = [...(detail.deposits || [])].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setRecords(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const getStatusClass = (status: string) => {
    if (status === 'approved') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'rejected') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  };

  const getDisplayAmount = (item: DepositItem) => {
    if (
      item.confirmationAmount !== null &&
      item.confirmationAmount !== undefined
    ) {
      return item.confirmationAmount;
    }

    return item.amount;
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
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-2xl text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Deposit records
        </h1>
        <div className="w-8" />
      </div>

      <div className="px-3 py-3">
        {records.length === 0 ? (
          <div className="rounded-xl bg-white px-4 py-8 text-center text-gray-500">
            No deposit records found
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((item) => (
              <div key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {getDisplayAmount(item)} USDT
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${getStatusClass(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Record ID:</span> {item.id}
                  </p>

                  <p>
                    <span className="font-medium">Requested Amount:</span>{' '}
                    {item.amount} USDT
                  </p>

                  {item.confirmationAmount !== null &&
                  item.confirmationAmount !== undefined ? (
                    <p>
                      <span className="font-medium">Confirmed Amount:</span>{' '}
                      {item.confirmationAmount} USDT
                    </p>
                  ) : null}

                  <p>
                    <span className="font-medium">Wallet:</span>{' '}
                    {item.walletName || '-'}
                  </p>

                  <p className="break-all">
                    <span className="font-medium">Address:</span>{' '}
                    {item.walletAddress || '-'}
                  </p>

                  <p>
                    <span className="font-medium">Currency:</span>{' '}
                    {item.currency || '-'}
                  </p>

                  <p>
                    <span className="font-medium">Network:</span>{' '}
                    {item.network || '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
