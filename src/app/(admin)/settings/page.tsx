'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type SettingsData = {
  id: number;
  dailyTaskLimit: number;

  vip1MinBalance: number;
  vip1MaxBalance: number;
  vip2MinBalance: number;
  vip2MaxBalance: number;
  vip3MinBalance: number;

  vip1Commission: number;
  vip2Commission: number;
  vip3Commission: number;

  phase1ComboCount: number;
  phase2ComboCount: number;
  phase3ComboCount: number;

  phase1ComboPositions: string;
  phase2ComboPositions: string;
  phase3ComboPositions: string;

  comboExtraAmount: number;
  normalOrderRatio: number;

  minDeposit: number;
  minWithdrawal: number;
  withdrawalFeeRate: number;

  taxControlMessage: string;
  telegramGroupLink: string;
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SettingsData | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      setForm({
        ...res.data,
        telegramGroupLink: res.data.telegramGroupLink || '',
      });
    } catch (error) {
      console.error(error);
      alert('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!form) return;

    const target = e.target;
    const { name, value, type } = target;

    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    try {
      setSaving(true);

      await api.patch('/settings', {
        dailyTaskLimit: form.dailyTaskLimit,

        vip1MinBalance: form.vip1MinBalance,
        vip1MaxBalance: form.vip1MaxBalance,
        vip2MinBalance: form.vip2MinBalance,
        vip2MaxBalance: form.vip2MaxBalance,
        vip3MinBalance: form.vip3MinBalance,

        vip1Commission: form.vip1Commission,
        vip2Commission: form.vip2Commission,
        vip3Commission: form.vip3Commission,

        phase1ComboCount: form.phase1ComboCount,
        phase2ComboCount: form.phase2ComboCount,
        phase3ComboCount: form.phase3ComboCount,

        phase1ComboPositions: form.phase1ComboPositions,
        phase2ComboPositions: form.phase2ComboPositions,
        phase3ComboPositions: form.phase3ComboPositions,

        comboExtraAmount: form.comboExtraAmount,
        normalOrderRatio: form.normalOrderRatio,

        minDeposit: form.minDeposit,
        minWithdrawal: form.minWithdrawal,
        withdrawalFeeRate: form.withdrawalFeeRate,

        taxControlMessage: form.taxControlMessage,
        telegramGroupLink: form.telegramGroupLink,
      });

      alert('Settings updated successfully');
      await fetchSettings();
    } catch (error) {
      console.error(error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <div className="text-gray-800">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <p className="text-sm text-gray-500">
          Configure task, VIP, combo, financial, and support settings
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Task Settings</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                Normal Order Ratio
              </label>
              <input
                type="number"
                step="0.01"
                name="normalOrderRatio"
                value={form.normalOrderRatio}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">VIP Balance Rules</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP1 Min Balance
              </label>
              <input
                type="number"
                step="0.01"
                name="vip1MinBalance"
                value={form.vip1MinBalance}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP1 Max Balance
              </label>
              <input
                type="number"
                step="0.01"
                name="vip1MaxBalance"
                value={form.vip1MaxBalance}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP1 Commission
              </label>
              <input
                type="number"
                step="0.0001"
                name="vip1Commission"
                value={form.vip1Commission}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP2 Min Balance
              </label>
              <input
                type="number"
                step="0.01"
                name="vip2MinBalance"
                value={form.vip2MinBalance}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP2 Max Balance
              </label>
              <input
                type="number"
                step="0.01"
                name="vip2MaxBalance"
                value={form.vip2MaxBalance}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP2 Commission
              </label>
              <input
                type="number"
                step="0.0001"
                name="vip2Commission"
                value={form.vip2Commission}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP3 Min Balance
              </label>
              <input
                type="number"
                step="0.01"
                name="vip3MinBalance"
                value={form.vip3MinBalance}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                VIP3 Commission
              </label>
              <input
                type="number"
                step="0.0001"
                name="vip3Commission"
                value={form.vip3Commission}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Combo Rules</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phase 1 Combo Count
              </label>
              <input
                type="number"
                name="phase1ComboCount"
                value={form.phase1ComboCount}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phase 1 Combo Positions
              </label>
              <input
                type="text"
                name="phase1ComboPositions"
                value={form.phase1ComboPositions}
                onChange={handleChange}
                placeholder="5"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phase 2 Combo Count
              </label>
              <input
                type="number"
                name="phase2ComboCount"
                value={form.phase2ComboCount}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phase 2 Combo Positions
              </label>
              <input
                type="text"
                name="phase2ComboPositions"
                value={form.phase2ComboPositions}
                onChange={handleChange}
                placeholder="5,15,25"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phase 3 Combo Count
              </label>
              <input
                type="number"
                name="phase3ComboCount"
                value={form.phase3ComboCount}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phase 3 Combo Positions
              </label>
              <input
                type="text"
                name="phase3ComboPositions"
                value={form.phase3ComboPositions}
                onChange={handleChange}
                placeholder="3,8,13,18,23"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Combo Extra Amount
              </label>
              <input
                type="number"
                step="0.01"
                name="comboExtraAmount"
                value={form.comboExtraAmount}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Financial Rules</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum Deposit
              </label>
              <input
                type="number"
                step="0.01"
                name="minDeposit"
                value={form.minDeposit}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum Withdrawal
              </label>
              <input
                type="number"
                step="0.01"
                name="minWithdrawal"
                value={form.minWithdrawal}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Withdrawal Fee Rate
              </label>
              <input
                type="number"
                step="0.0001"
                name="withdrawalFeeRate"
                value={form.withdrawalFeeRate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tax Control Message
            </label>
            <textarea
              name="taxControlMessage"
              value={form.taxControlMessage}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Support Settings</h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Telegram Group Link
            </label>
            <input
              type="text"
              name="telegramGroupLink"
              value={form.telegramGroupLink}
              onChange={handleChange}
              placeholder="https://t.me/your_group"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}