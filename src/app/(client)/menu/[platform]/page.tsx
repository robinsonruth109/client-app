'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import clientApi from '@/lib/client-api';

type ClientMe = {
  id: number;
  username: string;
  balance: number;
  vipLevel: number;
  todayTaskCount: number;
  dailyTaskLimit: number;
};

type SettingsData = {
  vip1Commission: number;
  vip2Commission: number;
  vip3Commission: number;
};

type PlatformStats = {
  todayTimes: number;
  todayCommission: number;
  cashGapBetweenTasks: number;
  yesterdayBuyCommission: number;
  yesterdayTeamCommission: number;
  moneyFrozenInAccounts: number;
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

type CurrentOrder = {
  id: number;
  orderNo: string;
  orderType: string;
  platform: string;
  vipLevel: number;
  orderAmount: number;
  commission: number;
  expectedIncome: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function PlatformPage() {
  const params = useParams<{ platform: string }>();
  const platform = decodeURIComponent(params.platform);

  const [client, setClient] = useState<ClientMe | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [activeOrder, setActiveOrder] = useState<CurrentOrder | null>(null);

  const [loading, setLoading] = useState(true);
  const [grabbing, setGrabbing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showNoOrderPopup, setShowNoOrderPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const commissionText = useMemo(() => {
    if (!client || !settings) return '0%';
    if (client.vipLevel === 1) return `${settings.vip1Commission * 100}%`;
    if (client.vipLevel === 2) return `${settings.vip2Commission * 100}%`;
    return `${settings.vip3Commission * 100}%`;
  }, [client, settings]);

  const fetchData = async () => {
    try {
      const meRes = await clientApi.get('/auth/client-me');
      const me = meRes.data as ClientMe;
      setClient(me);

      const [settingsRes, statsRes, detailRes] = await Promise.all([
        clientApi.get('/settings/public'),
        clientApi.get(
          `/orders/platform-stats/${me.id}?platform=${encodeURIComponent(platform)}`,
        ),
        clientApi.get(`/clients/${me.id}`),
      ]);

      setSettings(settingsRes.data);
      setStats(statsRes.data);

      const currentOrder = detailRes.data?.currentOrder;
      if (currentOrder && currentOrder.platform === platform) {
        setActiveOrder(currentOrder);
      } else {
        setActiveOrder(null);
      }
    } catch {
      setWarningMessage('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [platform]);

  const handleGrabOrder = async () => {
    if (!client) return;

    try {
      setGrabbing(true);

      const res = await clientApi.post('/orders/grab', {
        clientId: client.id,
        platform,
      });

      const order = res.data as CurrentOrder;

      if (!order?.items?.length) {
        setShowNoOrderPopup(true);
        return;
      }

      setActiveOrder(order);
      setShowOrderPopup(true);
      await fetchData();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'No order available';

      if (
        typeof msg === 'string' &&
        (msg.toLowerCase().includes('no order') ||
          msg.toLowerCase().includes('no products') ||
          msg.toLowerCase().includes('unable to generate'))
      ) {
        setShowNoOrderPopup(true);
      } else {
        setWarningMessage(msg);
      }
    } finally {
      setGrabbing(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!client || !activeOrder) return;

    try {
      setSubmitting(true);

      await clientApi.post('/orders/submit', {
        clientId: client.id,
        orderId: activeOrder.id,
      });

      setShowOrderPopup(false);
      setActiveOrder(null);
      await fetchData();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to submit order';

      setShowOrderPopup(false);
      setWarningMessage(message);
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
    <div className="min-h-screen bg-[#f3f3f3] pb-6">
      <div className="bg-[linear-gradient(90deg,#a94b57_0%,#7f5a61_100%)] px-4 pb-16 pt-3 text-white">
        <div className="mb-5 flex items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-[22px] leading-none"
          >
            ←
          </button>
          <h1 className="flex-1 text-center text-[18px] font-semibold leading-none">
            {platform}
          </h1>
          <div className="w-5" />
        </div>

        <p className="text-[13px] leading-none text-white">Account Balance:</p>
        <p className="mt-3 text-[22px] font-medium leading-none text-white">
          {Number(client?.balance ?? 0).toFixed(4)} USDT
        </p>
      </div>

      <div className="-mt-10 px-4">
        <div className="rounded-[8px] bg-white px-4 py-7 shadow-sm">
          <div className="grid grid-cols-2 gap-y-8 text-center">
            <div>
              <p className="text-[16px] font-medium leading-none text-[#222]">
                {stats?.todayTimes ?? 0}
              </p>
              <p className="mt-3 text-[12px] leading-[16px] text-[#9a9aa3]">
                Today&apos;s Times
              </p>
            </div>

            <div>
              <p className="text-[16px] font-medium leading-none text-[#222]">
                {stats?.todayCommission ?? 0}USDT
              </p>
              <p className="mt-3 text-[12px] leading-[16px] text-[#9a9aa3]">
                Today&apos;s commission
              </p>
            </div>

            <div>
              <p className="text-[16px] font-medium leading-none text-[#222]">
                {stats?.cashGapBetweenTasks ?? 0}USDT
              </p>
              <p className="mt-3 text-[12px] leading-[16px] text-[#9a9aa3]">
                Cash gap between tasks
              </p>
            </div>

            <div>
              <p className="text-[16px] font-medium leading-none text-[#222]">
                {stats?.yesterdayBuyCommission ?? 0}USDT
              </p>
              <p className="mt-3 text-[12px] leading-[16px] text-[#9a9aa3]">
                Yesterday&apos;s buy commission
              </p>
            </div>

            <div>
              <p className="text-[16px] font-medium leading-none text-[#222]">
                {stats?.yesterdayTeamCommission ?? 0}USDT
              </p>
              <p className="mt-3 text-[12px] leading-[16px] text-[#9a9aa3]">
                Yesterday&apos;s team commission
              </p>
            </div>

            <div>
              <p className="text-[16px] font-medium leading-none text-[#222]">
                {stats?.moneyFrozenInAccounts ?? 0}USDT
              </p>
              <p className="mt-3 text-[12px] leading-[16px] text-[#9a9aa3]">
                Money frozen in accounts
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGrabOrder}
          disabled={grabbing}
          className="mt-6 w-full rounded-full bg-[#7a5a61] py-[14px] text-[18px] font-medium text-white"
        >
          {grabbing ? 'Grabbing...' : 'Grab the order immediately'}
        </button>

        <div className="mt-7 px-1 text-[12px] leading-8 text-[#555]">
          <p className="mb-1 text-[13px] leading-none text-[#666]">Hint:</p>
          <p>1: {commissionText} of the amount of completed transactions earned.</p>
          <p>
            2: The system sends tasks randomly. Complete them as soon as
            possible after matching them, so as to avoid hanging all the time.
          </p>
        </div>
      </div>

      {showOrderPopup && activeOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[18px] bg-white p-4 shadow-xl">
            <div className="max-h-[60vh] space-y-3 overflow-y-auto">
              {activeOrder.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="rounded-[10px] bg-[#f6f6f6] p-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-[68px] w-[68px] rounded object-cover"
                    />

                    <div className="flex-1">
                      <p className="line-clamp-2 text-[14px] leading-[18px] text-[#555]">
                        {item.productName}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[14px] text-[#666]">
                        <span>{item.unitPrice}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-[14px] text-[#666]">
              <div className="flex justify-between">
                <span>Transaction time</span>
                <span>{new Date(activeOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Order amount</span>
                <span>{activeOrder.orderAmount}USDT</span>
              </div>
              <div className="flex justify-between">
                <span>Commissions</span>
                <span>{activeOrder.commission}USDT</span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-[15px] text-[#666]">Expected income</span>
              <span className="text-[22px] font-medium leading-none text-[#f08a2d]">
                {activeOrder.expectedIncome}USDT
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="mt-5 w-full rounded-[10px] bg-[#7a5a61] py-3 text-[17px] text-white"
            >
              {submitting ? 'Submitting...' : 'Submit order'}
            </button>
          </div>
        </div>
      ) : null}

      {showNoOrderPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-[14px] bg-black/75 px-5 py-4 text-center text-white">
            <p className="text-[16px] leading-6">
              No order yet, please contact customer service to get more task
              orders.
            </p>
            <button
              type="button"
              onClick={() => setShowNoOrderPopup(false)}
              className="mt-4 rounded-[10px] bg-white px-5 py-2 text-[14px] text-black"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}

      {warningMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="max-w-sm rounded-[14px] bg-black/80 px-5 py-4 text-center text-white">
            <p className="text-[16px] leading-6">{warningMessage}</p>
            <button
              type="button"
              onClick={() => setWarningMessage('')}
              className="mt-4 rounded-[10px] bg-white px-5 py-2 text-[14px] text-black"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}