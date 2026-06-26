import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, verifyPinApi } from '../services/authService';
import type { LoginRequest, PinVerifyRequest, AuthUser, Role } from '../types';

const ROLE_ROUTES: Record<string, string> = {
  Administrator: '/admin/dashboard',
  Patient: '/patient/dashboard',
  Clinician: '/clinician/dashboard',
  CareCoordinator: '/carecoordinator/dashboard',
  DeviceTechnician: '/devicetechnician/dashboard',
  Auditor: '/auditor/dashboard',
};

const decodeJwt = (token: string): AuthUser => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    userId: parseInt(payload.sub, 10),
    name: payload.name ?? '',
    email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? payload.email ?? '',
    role: (payload.role ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) as Role,
    token,
  };
};

export const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingMfa, setPendingMfa] = useState<{ email: string } | null>(null);

  const persistSession = (user: AuthUser) => {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginApi(credentials);
      if (data.requiresPin) {
        setPendingMfa({ email: credentials.email });
      } else if (data.success && data.token) {
        const user = decodeJwt(data.token);
        persistSession(user);
        navigate(ROLE_ROUTES[user.role] ?? '/login');
      } else {
        setError(data.message ?? 'Login failed.');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPin = async (pin: string) => {
    if (!pendingMfa) return;
    setLoading(true);
    setError(null);
    try {
      const payload: PinVerifyRequest = { email: pendingMfa.email, pin };
      const { data } = await verifyPinApi(payload);
      if (data.success && data.token) {
        const user = decodeJwt(data.token);
        persistSession(user);
        navigate(ROLE_ROUTES[user.role] ?? '/login');
      } else {
        setError(data.message ?? 'PIN verification failed.');
      }
    } catch {
      setError('Invalid PIN.');
    } finally {
      setLoading(false);
    }
  };

  return { login, verifyPin, loading, error, pendingMfa };
};
