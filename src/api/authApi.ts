import api from './axiosInstance';

export const login = (data: { email: string; password: string }) =>
  api.post('/api/auth/login', data);

export const register = (data: object) => api.post('/api/auth/register', data);

export const verifyPin = (data: { userId: number; pin: string }) =>
  api.post('/api/auth/login/verify-pin', data);

export const forgotPassword = (data: { email: string }) =>
  api.post('/api/auth/forgot-password', data);

export const resetPassword = (data: { token: string; newPassword: string }) =>
  api.post('/api/auth/reset-password', data);
