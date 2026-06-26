import { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';

export const useAdminResource = <T>(fetchFn: () => Promise<{ data: T[] }>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchFn();
      setData(res.data);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return { data, loading, error, reload: load };
};

export const useUsers = () => useAdminResource(adminService.getAllUsers as any);
export const useCharges = () => useAdminResource(adminService.getAllCharges as any);
export const useClaims = () => useAdminResource(adminService.getAllClaims as any);
export const usePayments = () => useAdminResource(adminService.getAllPayments as any);
export const useRules = () => useAdminResource(adminService.getAllRules as any);
export const useAdminNotifications = () => useAdminResource(adminService.getAllNotifications as any);
