'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type AdminUser = {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'staff',
    isActive: true,
  });

  const [editForm, setEditForm] = useState<{
    [key: number]: {
      username: string;
      password: string;
      role: string;
      isActive: boolean;
    };
  }>({});

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setAdmins(res.data);

      const mapped: typeof editForm = {};
      for (const admin of res.data) {
        mapped[admin.id] = {
          username: admin.username,
          password: '',
          role: admin.role,
          isActive: admin.isActive,
        };
      }
      setEditForm(mapped);
    } catch (error) {
      console.error(error);
      alert('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [target.name]:
        target.type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const handleEditChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;

    setEditForm((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [target.name]:
          target.type === 'checkbox' ? target.checked : target.value,
      },
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.post('/admin/users', {
        username: form.username,
        password: form.password,
        role: form.role,
        isActive: form.isActive,
      });

      setForm({
        username: '',
        password: '',
        role: 'staff',
        isActive: true,
      });

      await fetchAdmins();
      alert('Admin created successfully');
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      setUpdatingId(id);

      const payload: any = {
        username: editForm[id].username,
        role: editForm[id].role,
        isActive: editForm[id].isActive,
      };

      if (editForm[id].password.trim()) {
        payload.password = editForm[id].password;
      }

      await api.patch(`/admin/users/${id}`, payload);
      await fetchAdmins();
      alert('Admin updated successfully');
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to update admin');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this admin?',
    );

    if (!confirmed) return;

    try {
      setUpdatingId(id);
      await api.delete(`/admin/users/${id}`);
      await fetchAdmins();
      alert('Admin deleted successfully');
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to delete admin');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-semibold">Admin Management</h1>
        <p className="text-sm text-gray-500">
          Create and manage admin users
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Create New Admin</h2>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleCreateChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="text"
              name="password"
              value={form.password}
              onChange={handleCreateChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleCreateChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="super">Super</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3 text-gray-800">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleCreateChange}
                className="h-4 w-4"
              />
              <span>Active admin</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-black px-5 py-3 text-white"
            >
              {saving ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Admin List</h2>

        {loading ? (
          <p className="text-gray-600">Loading admins...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm text-gray-800">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>New Password</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b">
                    <td className="py-3">{admin.id}</td>

                    <td>
                      <input
                        type="text"
                        name="username"
                        value={editForm[admin.id]?.username || ''}
                        onChange={(e) => handleEditChange(admin.id, e)}
                        className="rounded border border-gray-300 px-2 py-1"
                      />
                    </td>

                    <td>
                      <select
                        name="role"
                        value={editForm[admin.id]?.role || 'staff'}
                        onChange={(e) => handleEditChange(admin.id, e)}
                        className="rounded border border-gray-300 bg-white px-2 py-1"
                      >
                        <option value="super">Super</option>
                        <option value="staff">Staff</option>
                      </select>
                    </td>

                    <td>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={editForm[admin.id]?.isActive || false}
                          onChange={(e) => handleEditChange(admin.id, e)}
                        />
                        <span>
                          {editForm[admin.id]?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    </td>

                    <td>
                      <input
                        type="text"
                        name="password"
                        value={editForm[admin.id]?.password || ''}
                        onChange={(e) => handleEditChange(admin.id, e)}
                        placeholder="Leave blank"
                        className="rounded border border-gray-300 px-2 py-1"
                      />
                    </td>

                    <td>{new Date(admin.createdAt).toLocaleString()}</td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(admin.id)}
                          disabled={updatingId === admin.id}
                          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => handleDelete(admin.id)}
                          disabled={updatingId === admin.id}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      No admins found
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