'use client';

import { useEffect, useState } from 'react';
import clientApi from '@/lib/client-api';

type ClientMe = {
  id: number;
  username: string;
  balance: number;
};

type ClientDetail = {
  id: number;
  deposits?: {
    id: number;
    amount: number;
    status: string;
    createdAt: string;
  }[];
  withdrawals?: {
    id: number;
    amount: number;
    fee: number;
    status: string;
    createdAt: string;
  }[];
};

type OrderRecord = {
  id: number;
  commission: number;
  status: 'incomplete' | 'complete';
  createdAt: string;
};

export default function TeamsPage() {
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);

  const [teamAmount, setTeamAmount] = useState(0);
  const [agentProfit, setAgentProfit] = useState(0);
  const [totalRecharge, setTotalRecharge] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [orderCommission, setOrderCommission] = useState(0);
  const [newcomers, setNewcomers] = useState(0);
  const [activitiesNumber, setActivitiesNumber] = useState(0);
  const [teamNumber, setTeamNumber] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await clientApi.get('/auth/client-me');
        const me = meRes.data as ClientMe;

        const [clientDetailRes, ordersRes] = await Promise.all([
          clientApi.get(`/clients/${me.id}`),
          clientApi.get(`/orders/records/${me.id}?status=complete`),
        ]);

        const clientDetail = clientDetailRes.data as ClientDetail;
        const completedOrders = (ordersRes.data || []) as OrderRecord[];

        const approvedDeposits = (clientDetail.deposits || []).filter(
          (item) => item.status === 'approved',
        );
        const paidWithdrawals = (clientDetail.withdrawals || []).filter(
          (item) => item.status === 'paid' || item.status === 'approved',
        );

        const totalRechargeValue = approvedDeposits.reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0,
        );

        const totalWithdrawValue = paidWithdrawals.reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0,
        );

        const totalCommissionValue = completedOrders.reduce(
          (sum, item) => sum + Number(item.commission || 0),
          0,
        );

        setTeamAmount(Number(me.balance || 0));
        setAgentProfit(0);
        setTotalRecharge(Number(totalRechargeValue.toFixed(2)));
        setTotalWithdraw(Number(totalWithdrawValue.toFixed(2)));
        setOrderCommission(Number(totalCommissionValue.toFixed(2)));
        setNewcomers(0);
        setActivitiesNumber(0);
        setTeamNumber(0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const levelHasData = false;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <div className="bg-gradient-to-r from-[#a94c57] to-[#7d5960] px-4 pb-8 pt-4 text-white">
        <div className="mb-6 flex items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-2xl"
          >
            ←
          </button>
          <h1 className="flex-1 text-center text-2xl font-semibold">Teams</h1>
          <div className="w-6" />
        </div>

        <div className="mb-8">
          <p className="text-lg">Team amount</p>
          <p className="mt-4 text-5xl font-medium">
            {teamAmount.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-y-8 text-center">
          <div className="px-2">
            <p className="text-2xl">{agentProfit}</p>
            <p className="mt-2 text-lg text-white/80">Agent Profit</p>
          </div>

          <div className="border-x border-white/30 px-2">
            <p className="text-2xl">{totalRecharge}</p>
            <p className="mt-2 text-lg text-white/80">Total recharge</p>
          </div>

          <div className="px-2">
            <p className="text-2xl">{totalWithdraw}</p>
            <p className="mt-2 text-lg text-white/80">Total withdraw</p>
          </div>

          <div className="px-2">
            <p className="text-2xl">{orderCommission}</p>
            <p className="mt-2 text-lg text-white/80">Order commission</p>
          </div>

          <div className="border-x border-white/30 px-2">
            <p className="text-2xl">{newcomers}</p>
            <p className="mt-2 text-lg text-white/80">Newcomers</p>
          </div>

          <div className="px-2">
            <p className="text-2xl">{activitiesNumber}</p>
            <p className="mt-2 text-lg text-white/80">Activities number</p>
          </div>

          <div className="col-span-3 mt-2 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl">{teamAmount.toFixed(2)}</p>
              <p className="mt-2 text-lg text-white/80">Team amount</p>
            </div>

            <div className="h-10 w-px bg-white/30" />

            <div className="text-center">
              <p className="text-2xl">{teamNumber}</p>
              <p className="mt-2 text-lg text-white/80">Team number</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="grid grid-cols-3 text-center">
          <button
            type="button"
            onClick={() => setActiveLevel(1)}
            className="py-4"
          >
            <span
              className={`text-xl ${
                activeLevel === 1 ? 'text-[#7a5a61]' : 'text-gray-700'
              }`}
            >
              Level 1
            </span>
            <div
              className={`mx-auto mt-2 h-1 w-12 rounded-full ${
                activeLevel === 1 ? 'bg-[#7a5a61]' : 'bg-transparent'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveLevel(2)}
            className="py-4"
          >
            <span
              className={`text-xl ${
                activeLevel === 2 ? 'text-[#7a5a61]' : 'text-gray-700'
              }`}
            >
              Level 2
            </span>
            <div
              className={`mx-auto mt-2 h-1 w-12 rounded-full ${
                activeLevel === 2 ? 'bg-[#7a5a61]' : 'bg-transparent'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveLevel(3)}
            className="py-4"
          >
            <span
              className={`text-xl ${
                activeLevel === 3 ? 'text-[#7a5a61]' : 'text-gray-700'
              }`}
            >
              Level 3
            </span>
            <div
              className={`mx-auto mt-2 h-1 w-12 rounded-full ${
                activeLevel === 3 ? 'bg-[#7a5a61]' : 'bg-transparent'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="px-4 py-8">
        {!levelHasData ? (
          <p className="text-center text-lg text-gray-400">No data</p>
        ) : null}
      </div>
    </div>
  );
}