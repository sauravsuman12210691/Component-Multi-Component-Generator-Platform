import axios from 'axios';

export const tokenManager = {
  setToken: (token: string) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // or your backend API base
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (email: string, password: string) => {
    const res = await axiosInstance.post('/auth/signup', { email, password });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },
};
