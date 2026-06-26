import { useEffect, useState } from 'react';

export const useResource = <T>(fetchFn: () => Promise<{ data: T[] | T }>) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchFn();
      const payload = res.data;
      setData(Array.isArray(payload) ? payload : [payload]);
    } catch {
      setError('Failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return { data, loading, error, reload: load };
};
