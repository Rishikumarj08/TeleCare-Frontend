import { useEffect, useState } from 'react';

export const useClinicianResource = <T>(fetchFn: () => Promise<{ data: T[] }>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchFn();
      setData(res.data);
    } catch {
      setError('Failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return { data, loading, error, reload: load };
};
