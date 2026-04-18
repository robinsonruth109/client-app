'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';

type DashboardData = {
  totalClients: number;
  approvedClients: number;
  frozenClients: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalClientBalance: number;
  topClients: {
    id: number;
    username: string;
    balance: number;
    vipLevel: number;
    isApproved: boolean;
    isFrozen: boolean;
  }[];
};

type DepositItem = {
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

type WithdrawalItem = {
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

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [pendingDepositsList, setPendingDepositsList] = useState<DepositItem[]>(
    [],
  );
  const [pendingWithdrawalsList, setPendingWithdrawalsList] = useState<
    WithdrawalItem[]
  >([]);
  const [allDeposits, setAllDeposits] = useState<DepositItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchDashboard = useCallback(async (isSilent = false) => {
    try {
      if (isSilent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [dashboardRes, depositsRes, withdrawalsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/deposits'),
        api.get('/withdrawals'),
      ]);

      const dashboard = dashboardRes.data as DashboardData;
      const deposits = depositsRes.data as DepositItem[];
      const withdrawals = withdrawalsRes.data as WithdrawalItem[];

      const pendingDeposits = deposits.filter((item) => item.status === 'pending');
      const pendingWithdrawals = withdrawals.filter(
        (item) => item.status === 'pending' || item.status === 'approved',
      );

      setData(dashboard);
      setAllDeposits(deposits);
      setPendingDepositsList(
        pendingDeposits.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      setPendingWithdrawalsList(
        pendingWithdrawals.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboard(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboard]);

  const totalApprovedDepositAmount = useMemo(() => {
    return Number(
      allDeposits
        .filter((item) => item.status === 'approved')
        .reduce((sum, item) => {
          const value =
            item.confirmationAmount !== null &&
            item.confirmationAmount !== undefined
              ? Number(item.confirmationAmount)
              : Number(item.amount);

          return sum + (Number.isNaN(value) ? 0 : value);
        }, 0)
        .toFixed(2),
    );
  }, [allDeposits]);

  if (loading) {
    return <div className="text-gray-800">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-gray-800">Failed to load dashboard.</div>;
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of clients, deposits, withdrawals, and activity
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>

          <button
            type="button"
            onClick={() => setAutoRefresh((prev) => !prev)}
            className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-white ${
              autoRefresh ? 'bg-green-600' : 'bg-gray-500'
            }`}
          >
            <span>{autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}</span>
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full bg-white ${
                autoRefresh ? 'opacity-100' : 'opacity-70'
              }`}
            />
          </button>

          <span className="text-sm text-gray-500">
            {autoRefresh ? 'Refreshing every 10s' : 'Auto refresh disabled'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-7">
        <SummaryCard
          title="Total Clients"
          value={data.totalClients}
          subtitle="All registered users"
        />
        <SummaryCard
          title="Approved Clients"
          value={data.approvedClients}
          subtitle="Allowed to work"
        />
        <SummaryCard
          title="Frozen Clients"
          value={data.frozenClients}
          subtitle="Currently blocked"
        />
        <SummaryCard
          title="Pending Deposits"
          value={data.pendingDeposits}
          subtitle="Need admin action"
        />
        <SummaryCard
          title="Pending Withdrawals"
          value={data.pendingWithdrawals}
          subtitle="Need admin action"
        />
        <SummaryCard
          title="Total Client Balance"
          value={data.totalClientBalance}
          subtitle="Combined balance"
        />
        <SummaryCard
          title="Approved Deposit Amount"
          value={totalApprovedDepositAmount}
          subtitle="Total approved deposits"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Deposit Requests
              </h2>
              <p className="text-sm text-gray-500">
                Latest pending client deposits
              </p>
            </div>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              {pendingDepositsList.length} pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingDepositsList.slice(0, 8).map((deposit) => (
              <div
                key={deposit.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {deposit.client?.username || `Client #${deposit.clientId}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Deposit #{deposit.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {deposit.amount} USDT
                    </p>
                    <p className="text-xs text-yellow-700">{deposit.status}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Wallet:</span>{' '}
                    {deposit.walletName || '-'}
                  </p>
                  <p className="break-all">
                    <span className="font-medium">Address:</span>{' '}
                    {deposit.walletAddress || '-'}
                  </p>
                  <p>
                    <span className="font-medium">Currency:</span>{' '}
                    {deposit.currency || '-'} / {deposit.network || '-'}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(deposit.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {pendingDepositsList.length === 0 ? (
              <p className="text-sm text-gray-500">No pending deposits.</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Withdrawal Requests
              </h2>
              <p className="text-sm text-gray-500">
                Latest pending or approved withdrawals
              </p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {pendingWithdrawalsList.length} open
            </span>
          </div>

          <div className="space-y-3">
            {pendingWithdrawalsList.slice(0, 8).map((withdrawal) => {
              const net = Number(
                (withdrawal.amount - withdrawal.fee).toFixed(2),
              );

              return (
                <div
                  key={withdrawal.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {withdrawal.client?.username ||
                          `Client #${withdrawal.clientId}`}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Withdrawal #{withdrawal.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {withdrawal.amount} USDT
                      </p>
                      <p
                        className={`text-xs ${
                          withdrawal.status === 'approved'
                            ? 'text-green-700'
                            : 'text-yellow-700'
                        }`}
                      >
                        {withdrawal.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Fee:</span> {withdrawal.fee}
                    </p>
                    <p>
                      <span className="font-medium">Net:</span> {net}
                    </p>
                    <p>
                      <span className="font-medium">Balance:</span>{' '}
                      {withdrawal.client?.balance ?? '-'}
                    </p>
                    <p>
                      <span className="font-medium">Frozen:</span>{' '}
                      {withdrawal.client?.isFrozen ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <span className="font-medium">Tax:</span>{' '}
                      {withdrawal.client?.taxControl ? 'Enabled' : 'Off'}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}

            {pendingWithdrawalsList.length === 0 ? (
              <p className="text-sm text-gray-500">No open withdrawals.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top Clients</h2>
            <p className="text-sm text-gray-500">
              Highest-balance client overview
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {data.topClients.length} clients
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {data.topClients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
            >
              <div>
                <p className="font-medium text-gray-900">{client.username}</p>
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                    VIP {client.vipLevel}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 ${
                      client.isApproved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {client.isApproved ? 'Approved' : 'Not Approved'}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 ${
                      client.isFrozen
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {client.isFrozen ? 'Frozen' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {client.balance}
                </p>
                <p className="text-sm text-gray-500">Balance</p>
              </div>
            </div>
          ))}

          {data.topClients.length === 0 ? (
            <p className="text-sm text-gray-500">No clients found.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number | string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}