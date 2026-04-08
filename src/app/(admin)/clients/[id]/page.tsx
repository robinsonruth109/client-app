'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';

type OrderItem = {
  id: number;
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
  submittedAt?: string | null;
  items: OrderItem[];
};

type TaskRow = {
  taskNo: number;
  taskAmount: number | null;
  commission: number | null;
  action: string;
};

type ClientDetail = {
  id: number;
  username: string;
  balance: number;
  vipLevel: number;
  isApproved: boolean;
  isFrozen: boolean;
  taxControl: boolean;
  canGrabOrders: boolean;
  isManualTaskControl: boolean;
  dailyTaskLimit: number;
  todayTaskCount: number;
  workPhase: number;
  invitationCode?: string;
  createdAt: string;
  ipCount: number;
  ipAddresses: string[];
  deposits: {
    id: number;
    amount: number;
    status: string;
    createdAt: string;
  }[];
  withdrawals: {
    id: number;
    amount: number;
    fee: number;
    status: string;
    createdAt: string;
  }[];
  currentOrder: CurrentOrder | null;
  taskControls: TaskRow[];
};

type ClientForm = {
  balance: number;
  vipLevel: number;
  isApproved: boolean;
  isFrozen: boolean;
  taxControl: boolean;
  canGrabOrders: boolean;
  dailyTaskLimit: number;
  todayTaskCount: number;
  workPhase: number;
};

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingClient, setSavingClient] = useState(false);
  const [savingTaskControls, setSavingTaskControls] = useState(false);
  const [togglingManualMode, setTogglingManualMode] = useState(false);

  const [form, setForm] = useState<ClientForm>({
    balance: 0,
    vipLevel: 1,
    isApproved: false,
    isFrozen: false,
    taxControl: false,
    canGrabOrders: false,
    dailyTaskLimit: 25,
    todayTaskCount: 0,
    workPhase: 1,
  });

  const [manualMode, setManualMode] = useState(false);
  const [taskControls, setTaskControls] = useState<TaskRow[]>([]);

  const fetchClient = async () => {
    try {
      const res = await api.get(`/clients/${id}`);
      const data = res.data as ClientDetail;

      setClient(data);
      setManualMode(Boolean(data.isManualTaskControl));
      setTaskControls(data.taskControls || []);

      setForm({
        balance: Number(data.balance ?? 0),
        vipLevel: Number(data.vipLevel ?? 1),
        isApproved: Boolean(data.isApproved),
        isFrozen: Boolean(data.isFrozen),
        taxControl: Boolean(data.taxControl),
        canGrabOrders: Boolean(data.canGrabOrders),
        dailyTaskLimit: Number(data.dailyTaskLimit ?? 25),
        todayTaskCount: Number(data.todayTaskCount ?? 0),
        workPhase: Number(data.workPhase ?? 1),
      });
    } catch (error: any) {
      console.error(error?.response?.data || error);
      alert(error?.response?.data?.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [target.name]:
        target.type === 'checkbox'
          ? target.checked
          : target.type === 'number'
            ? target.value === ''
              ? 0
              : Number(target.value)
            : Number(target.value),
    }));
  };

  const buildClientPayload = () => {
    return {
      balance: Number(form.balance),
      vipLevel: Number(form.vipLevel),
      isApproved: Boolean(form.isApproved),
      isFrozen: Boolean(form.isFrozen),
      taxControl: Boolean(form.taxControl),
      canGrabOrders: Boolean(form.canGrabOrders),
      dailyTaskLimit: Number(form.dailyTaskLimit),
      todayTaskCount: Number(form.todayTaskCount),
      workPhase: Number(form.workPhase),
    };
  };

  const handleSaveClient = async () => {
    try {
      setSavingClient(true);

      const payload = buildClientPayload();

      await api.patch(`/clients/${id}`, payload);
      await fetchClient();
      alert('Client updated successfully');
    } catch (error: any) {
      console.error(error?.response?.data || error);
      alert(error?.response?.data?.message || 'Failed to update client');
    } finally {
      setSavingClient(false);
    }
  };

  const handleTaskChange = (
    index: number,
    field: 'taskAmount' | 'commission',
    value: string,
  ) => {
    const updated = [...taskControls];

    updated[index] = {
      ...updated[index],
      [field]: value.trim() === '' ? null : Number(value),
    };

    updated[index].action =
      updated[index].taskAmount !== null &&
      updated[index].taskAmount !== undefined &&
      updated[index].taskAmount > 0
        ? 'Combo'
        : 'Normal Task';

    setTaskControls(updated);
  };

  const handleSaveTaskControls = async () => {
    try {
      setSavingTaskControls(true);

      const payload = {
        tasks: taskControls.map((row) => ({
          taskNo: Number(row.taskNo),
          taskAmount:
            row.taskAmount === null || Number.isNaN(Number(row.taskAmount))
              ? null
              : Number(row.taskAmount),
          commission:
            row.commission === null || Number.isNaN(Number(row.commission))
              ? null
              : Number(row.commission),
        })),
      };

      await api.put(`/clients/${id}/task-control`, payload);

      await fetchClient();
      alert('Manual task setup saved successfully');
    } catch (error: any) {
      console.error(error?.response?.data || error);
      alert(error?.response?.data?.message || 'Failed to save manual task setup');
    } finally {
      setSavingTaskControls(false);
    }
  };

  const toggleManualMode = async () => {
    try {
      setTogglingManualMode(true);

      await api.patch(`/clients/${id}/manual-mode`, {
        isManualTaskControl: !manualMode,
      });

      await fetchClient();
      alert(
        !manualMode
          ? 'Manual control activated'
          : 'Switched back to system control',
      );
    } catch (error: any) {
      console.error(error?.response?.data || error);
      alert(error?.response?.data?.message || 'Failed to toggle manual control');
    } finally {
      setTogglingManualMode(false);
    }
  };

  if (loading) {
    return <div className="text-gray-800">Loading client...</div>;
  }

  if (!client) {
    return <div className="text-gray-800">Client not found.</div>;
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Client Detail</h1>
        <p className="text-sm text-gray-500">
          {client.username} · ID {client.id}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Client Controls
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Balance
              </label>
              <input
                type="number"
                name="balance"
                value={form.balance}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP Level
              </label>
              <select
                name="vipLevel"
                value={form.vipLevel}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
              >
                <option value={1}>VIP 1</option>
                <option value={2}>VIP 2</option>
                <option value={3}>VIP 3</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Daily Task Limit
              </label>
              <input
                type="number"
                name="dailyTaskLimit"
                value={form.dailyTaskLimit}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Today Task Count
              </label>
              <input
                type="number"
                name="todayTaskCount"
                value={form.todayTaskCount}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Work Phase
              </label>
              <select
                name="workPhase"
                value={form.workPhase}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
              >
                <option value={1}>Phase 1</option>
                <option value={2}>Phase 2</option>
                <option value={3}>Phase 3</option>
              </select>
            </div>

            <label className="flex items-center gap-3 text-gray-800">
              <input
                type="checkbox"
                name="isApproved"
                checked={form.isApproved}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Approved for work</span>
            </label>

            <label className="flex items-center gap-3 text-gray-800">
              <input
                type="checkbox"
                name="isFrozen"
                checked={form.isFrozen}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Frozen account</span>
            </label>

            <label className="flex items-center gap-3 text-gray-800">
              <input
                type="checkbox"
                name="canGrabOrders"
                checked={form.canGrabOrders}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Allow order grabbing</span>
            </label>

            <label className="flex items-center gap-3 text-gray-800">
              <input
                type="checkbox"
                name="taxControl"
                checked={form.taxControl}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Tax control enabled</span>
            </label>

            <button
              onClick={handleSaveClient}
              disabled={savingClient}
              className="mt-2 rounded-xl bg-black px-4 py-3 text-white transition hover:bg-gray-800"
            >
              {savingClient ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Client Info
          </h2>

          <div className="space-y-3 text-sm text-gray-800">
            <p>
              <strong>Username:</strong> {client.username}
            </p>
            <p>
              <strong>Invitation Code:</strong> {client.invitationCode || '-'}
            </p>
            <p>
              <strong>Balance:</strong> {client.balance}
            </p>
            <p>
              <strong>VIP:</strong> {client.vipLevel}
            </p>
            <p>
              <strong>IP Count:</strong> {client.ipCount}
            </p>
            <p>
              <strong>IPs:</strong> {client.ipAddresses.join(', ') || 'No IPs'}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(client.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Manual Control Mode:</strong> {manualMode ? 'ON' : 'OFF'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Current Task / Order
        </h2>

        {client.currentOrder ? (
          <div className="space-y-3 text-sm text-gray-800">
            <p>
              <strong>Order No:</strong> {client.currentOrder.orderNo}
            </p>
            <p>
              <strong>Order Type:</strong> {client.currentOrder.orderType}
            </p>
            <p>
              <strong>Platform:</strong> {client.currentOrder.platform}
            </p>
            <p>
              <strong>Current Task Amount:</strong>{' '}
              {client.currentOrder.orderAmount}
            </p>
            <p>
              <strong>Commission:</strong> {client.currentOrder.commission}
            </p>
            <p>
              <strong>Expected Income:</strong>{' '}
              {client.currentOrder.expectedIncome}
            </p>
            <p>
              <strong>Status:</strong> {client.currentOrder.status}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(client.currentOrder.createdAt).toLocaleString()}
            </p>

            {client.currentOrder.items?.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="font-semibold text-gray-900">Order Items</p>
                {client.currentOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 p-3"
                  >
                    <p>
                      <strong>Product:</strong> {item.productName}
                    </p>
                    <p>
                      <strong>Unit Price:</strong> {item.unitPrice}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> {item.subtotal}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active task.</p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Manual Task Control
            </h2>
            <p className="text-sm text-gray-500">
              Set task amount and commission manually for each of 25 tasks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleManualMode}
              disabled={togglingManualMode}
              className={`rounded-xl px-5 py-2 text-white ${
                manualMode ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              {manualMode
                ? 'Kill ON (Manual Active)'
                : 'Kill OFF (System Mode)'}
            </button>

            <span className="text-sm text-gray-600">
              {manualMode
                ? 'Manual task control is active'
                : 'Default system logic is active'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[900px] text-sm text-gray-800">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="px-3 py-3 text-left">Task No</th>
                <th className="px-3 text-left">Task Amount</th>
                <th className="px-3 text-left">Commission (%)</th>
                <th className="px-3 text-left">Com Action</th>
              </tr>
            </thead>

            <tbody>
              {taskControls.map((row, index) => (
                <tr key={row.taskNo} className="border-b">
                  <td className="px-3 py-2 font-medium">
                    {String(row.taskNo).padStart(2, '0')}
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.taskAmount ?? ''}
                      onChange={(e) =>
                        handleTaskChange(index, 'taskAmount', e.target.value)
                      }
                      className="w-32 rounded border border-gray-300 px-2 py-1 outline-none focus:border-black"
                      placeholder="—"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.commission ?? ''}
                      onChange={(e) =>
                        handleTaskChange(index, 'commission', e.target.value)
                      }
                      className="w-28 rounded border border-gray-300 px-2 py-1 outline-none focus:border-black"
                      placeholder="—"
                    />
                  </td>

                  <td className="px-3 py-2">
                    {row.taskAmount !== null &&
                    row.taskAmount !== undefined &&
                    row.taskAmount > 0 ? (
                      <span className="font-semibold text-red-600">Combo</span>
                    ) : (
                      <span className="text-gray-500">Normal Task</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <button
            onClick={handleSaveTaskControls}
            disabled={savingTaskControls}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {savingTaskControls ? 'Saving...' : 'Save Manual Setup'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Deposit History
        </h2>

        <div className="space-y-3">
          {client.deposits.length > 0 ? (
            client.deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="rounded-xl border border-gray-200 p-3 text-sm text-gray-800"
              >
                <p>
                  <strong>ID:</strong> {deposit.id}
                </p>
                <p>
                  <strong>Amount:</strong> {deposit.amount}
                </p>
                <p>
                  <strong>Status:</strong> {deposit.status}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(deposit.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No deposits found.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Withdrawal History
        </h2>

        <div className="space-y-3">
          {client.withdrawals.length > 0 ? (
            client.withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="rounded-xl border border-gray-200 p-3 text-sm text-gray-800"
              >
                <p>
                  <strong>ID:</strong> {withdrawal.id}
                </p>
                <p>
                  <strong>Amount:</strong> {withdrawal.amount}
                </p>
                <p>
                  <strong>Fee:</strong> {withdrawal.fee}
                </p>
                <p>
                  <strong>Status:</strong> {withdrawal.status}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(withdrawal.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No withdrawals found.</p>
          )}
        </div>
      </div>
    </div>
  );
}