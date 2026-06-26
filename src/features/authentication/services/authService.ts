import axiosInstance from '../../../utils/axiosInstance';
import type {
  LoginRequest,
  LoginResponse,
  PinVerifyRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types';

export const registerApi = (data: RegisterRequest) =>
  axiosInstance.post('/api/auth/register', data);

export const loginApi = (data: LoginRequest) =>
  axiosInstance.post<LoginResponse>('/api/auth/login', data);

export const verifyPinApi = (data: PinVerifyRequest) =>
  axiosInstance.post<LoginResponse>('/api/auth/login/verify-pin', data);

export const forgotPasswordApi = (data: ForgotPasswordRequest) =>
  axiosInstance.post('/api/auth/forgot-password', data);

export const resetPasswordApi = (data: ResetPasswordRequest) =>
  axiosInstance.post('/api/auth/reset-password', data);
