import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../services/authService';
import type { RegisterRequest } from '../types';

export const useRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      await registerApi(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};
