import axios from 'axios';

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

clientApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('client_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default clientApi;
