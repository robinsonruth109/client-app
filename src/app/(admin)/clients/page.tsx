'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

type Client = {
  id: number;
  username: string;
  balance: number;
  vipLevel: number;
  isApproved: boolean;
  isFrozen: boolean;
  taxControl: boolean;
  canGrabOrders: boolean;
  dailyTaskLimit: number;
  todayTaskCount: number;
  workPhase: number;
  invitationCode?: string;
  referredByCode?: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchClients = async (searchValue = '') => {
    try {
      setLoading(true);

      const url = searchValue.trim()
        ? `/clients?search=${encodeURIComponent(searchValue.trim())}`
        : '/clients';

      const res = await api.get(url);
      setClients(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const toggleClient = async (
    id: number,
    field: 'isApproved' | 'isFrozen' | 'canGrabOrders',
    value: boolean,
  ) => {
    try {
      setUpdatingId(id);

      await api.patch(`/clients/${id}`, {
        [field]: value,
      });

      await fetchClients(search);
    } catch (error) {
      console.error(error);
      alert('Failed to update client');
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ DELETE CLIENT
  const deleteClient = async (id: number) => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this client?',
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await api.delete(`/clients/${id}`);

      await fetchClients(search);
      alert('Client deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete client');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchClients(search);
              }
            }}
            className="w-64 rounded-xl border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-black"
          />

          <button
            onClick={() => fetchClients(search)}
            className="rounded-xl bg-black px-4 py-2 text-white"
          >
            Search
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow">
        {loading ? (
          <p className="text-gray-600">Loading clients...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm text-gray-800">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">ID</th>
                  <th>Username</th>
                  <th>Balance</th>
                  <th>VIP</th>
                  <th>Own Code</th>
                  <th>Referred By</th>
                  <th>Approved</th>
                  <th>Frozen</th>
                  <th>Grab</th>
                  <th>Tasks</th>
                  <th>Phase</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="py-3">{client.id}</td>
                    <td>{client.username}</td>
                    <td>{client.balance}</td>
                    <td>VIP {client.vipLevel}</td>
                    <td>{client.invitationCode || '-'}</td>
                    <td>{client.referredByCode || '-'}</td>

                    <td>
                      <button
                        disabled={updatingId === client.id}
                        onClick={() =>
                          toggleClient(
                            client.id,
                            'isApproved',
                            !client.isApproved,
                          )
                        }
                        className={`rounded px-3 py-1 text-sm ${
                          client.isApproved
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-900'
                        }`}
                      >
                        {client.isApproved ? 'Approved' : 'Approve'}
                      </button>
                    </td>

                    <td>
                      <button
                        disabled={updatingId === client.id}
                        onClick={() =>
                          toggleClient(
                            client.id,
                            'isFrozen',
                            !client.isFrozen,
                          )
                        }
                        className={`rounded px-3 py-1 text-sm ${
                          client.isFrozen
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-300 text-gray-900'
                        }`}
                      >
                        {client.isFrozen ? 'Frozen' : 'Freeze'}
                      </button>
                    </td>

                    <td>
                      <button
                        disabled={updatingId === client.id}
                        onClick={() =>
                          toggleClient(
                            client.id,
                            'canGrabOrders',
                            !client.canGrabOrders,
                          )
                        }
                        className={`rounded px-3 py-1 text-sm ${
                          client.canGrabOrders
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-900'
                        }`}
                      >
                        {client.canGrabOrders ? 'Enabled' : 'Enable'}
                      </button>
                    </td>

                    <td>
                      {client.todayTaskCount}/{client.dailyTaskLimit}
                    </td>

                    <td>{client.workPhase}</td>

                    {/* ✅ ACTION COLUMN UPDATED */}
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/clients/${client.id}`}
                          className="rounded bg-black px-3 py-1 text-sm text-white"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => deleteClient(client.id)}
                          disabled={deletingId === client.id}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                        >
                          {deletingId === client.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {clients.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={12} className="py-6 text-center text-gray-500">
                      No clients found
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
