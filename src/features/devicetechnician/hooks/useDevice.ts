import { useState } from 'react';
import * as deviceService from '../services/deviceService';

export const useDevices = () => {
  const [devices, setDevices] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filter = async (params: object = {}) => {
    setLoading(true);
    try {
      const res = await deviceService.filterDevices(params);
      setDevices(res.data as Record<string, unknown>[]);
    } catch {
      setError('Failed to load devices.');
    } finally {
      setLoading(false);
    }
  };

  return { devices, loading, error, filter };
};
