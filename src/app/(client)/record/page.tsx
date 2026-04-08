'use client';

import { useEffect, useState } from 'react';
import clientApi from '@/lib/client-api';

type ClientMe = {
  id: number;
};

type OrderItem = {
  id?: number;
  productId: number;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

type OrderRecord = {
  id: number;
  orderNo: string;
  orderType: string;
  status: 'incomplete' | 'complete';
  platform: string;
  vipLevel: number;
  orderAmount: number;
  commission: number;
  expectedIncome: number;
  createdAt: string;
  submittedAt?: string | null;
  items: OrderItem[];
};

export default function RecordPage() {
  const [activeTab, setActiveTab] = useState<'incomplete' | 'complete'>(
    'incomplete',
  );
  const [clientId, setClientId] = useState<number | null>(null);
  const [records, setRecords] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingOrderId, setSubmittingOrderId] = useState<number | null>(
    null,
  );
  const [warningMessage, setWarningMessage] = useState('');

  const fetchRecords = async (status: 'incomplete' | 'complete') => {
    try {
      setLoading(true);

      let currentClientId = clientId;

      if (!currentClientId) {
        const meRes = await clientApi.get('/auth/client-me');
        currentClientId = meRes.data.id;
        setClientId(currentClientId);
      }

      const res = await clientApi.get(
        `/orders/records/${currentClientId}?status=${status}`,
      );

      setRecords(res.data || []);
    } catch (error: any) {
      setWarningMessage(
        error?.response?.data?.message || 'Failed to load records',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(activeTab);
  }, [activeTab]);

  const handleSubmitOrder = async (orderId: number) => {
    if (!clientId) return;

    try {
      setSubmittingOrderId(orderId);

      await clientApi.post('/orders/submit', {
        clientId,
        orderId,
      });

      await fetchRecords('incomplete');
    } catch (error: any) {
      setWarningMessage(
        error?.response?.data?.message || 'Failed to submit order',
      );
    } finally {
      setSubmittingOrderId(null);
    }
  };

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
        <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900">
          Record
        </h1>
        <div className="w-8" />
      </div>

      <div className="mt-2 bg-white px-4">
        <div className="grid grid-cols-2 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('incomplete')}
            className="py-4"
          >
            <span
              className={`text-xl ${
                activeTab === 'incomplete'
                  ? 'text-[#7a5a61]'
                  : 'text-gray-700'
              }`}
            >
              Incomplete
            </span>
            <div
              className={`mx-auto mt-2 h-1 w-20 rounded-full ${
                activeTab === 'incomplete' ? 'bg-[#7a5a61]' : 'bg-transparent'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('complete')}
            className="py-4"
          >
            <span
              className={`text-xl ${
                activeTab === 'complete' ? 'text-[#7a5a61]' : 'text-gray-700'
              }`}
            >
              Complete
            </span>
            <div
              className={`mx-auto mt-2 h-1 w-20 rounded-full ${
                activeTab === 'complete' ? 'bg-[#7a5a61]' : 'bg-transparent'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="px-3 py-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
            Loading...
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-400">
            No more
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="mb-3 text-sm text-gray-600">
                  Order Nos: {record.orderNo}
                </div>

                <div className="space-y-3">
                  {record.items.map((item, index) => (
                    <div
                      key={`${record.id}-${item.productId}-${index}`}
                      className="rounded-xl bg-[#f7f7f7] p-3"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-20 w-20 rounded object-cover"
                        />

                        <div className="flex-1">
                          <p className="line-clamp-2 text-base text-gray-700">
                            {item.productName}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-lg text-gray-700">
                              {item.unitPrice}USDT
                            </span>
                            <span className="text-lg text-gray-500">
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4 text-lg text-gray-600">
                  <div className="flex justify-between py-1">
                    <span>Transaction time</span>
                    <span>
                      {new Date(
                        record.submittedAt || record.createdAt,
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Order amount</span>
                    <span>{record.orderAmount}USDT</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Commissions</span>
                    <span>{record.commission}USDT</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Expected income</span>
                    <span className="text-3xl text-[#f08a2d]">
                      {record.expectedIncome}USDT
                    </span>
                  </div>
                </div>

                {activeTab === 'incomplete' ? (
                  <button
                    type="button"
                    onClick={() => handleSubmitOrder(record.id)}
                    disabled={submittingOrderId === record.id}
                    className="mt-5 w-full rounded-xl bg-[#7a5a61] py-4 text-2xl text-white"
                  >
                    {submittingOrderId === record.id
                      ? 'Submitting...'
                      : 'Submit order'}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {warningMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="max-w-sm rounded-2xl bg-black/80 px-5 py-4 text-center text-white">
            <p className="text-lg">{warningMessage}</p>
            <button
              type="button"
              onClick={() => setWarningMessage('')}
              className="mt-4 rounded-xl bg-white px-5 py-2 text-black"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}