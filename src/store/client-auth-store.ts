'use client';

import { create } from 'zustand';

type ClientUser = {
  id: number;
  username: string;
  balance: number;
  vipLevel: number;
};

type ClientAuthState = {
  client: ClientUser | null;
  token: string | null;
  setAuth: (token: string, client: ClientUser) => void;
  clearAuth: () => void;
  loadFromStorage: () => void;
};

export const useClientAuthStore = create<ClientAuthState>((set) => ({
  client: null,
  token: null,

  setAuth: (token, client) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('client_token', token);
      localStorage.setItem('client_user', JSON.stringify(client));
    }

    set({ token, client });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('client_token');
      localStorage.removeItem('client_user');
    }

    set({ token: null, client: null });
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('client_token');
    const rawClient = localStorage.getItem('client_user');

    set({
      token,
      client: rawClient ? JSON.parse(rawClient) : null,
    });
  },
}));