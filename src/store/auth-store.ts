import { create } from 'zustand';

type AdminUser = {
  id: number;
  username: string;
  role: string;
};

type AuthState = {
  token: string | null;
  admin: AdminUser | null;
  setAuth: (token: string, admin: AdminUser) => void;
  loadAuth: () => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  admin: null,

  setAuth: (token, admin) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(admin));
    }

    set({ token, admin });
  },

  loadAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      const adminUser = localStorage.getItem('admin_user');

      set({
        token: token || null,
        admin: adminUser ? JSON.parse(adminUser) : null,
      });
    }
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }

    set({ token: null, admin: null });
  },
}));