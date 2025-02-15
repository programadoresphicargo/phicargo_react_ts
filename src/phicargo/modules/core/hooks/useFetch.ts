import { useState } from 'react';

export const useFetch = <T>(fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchFn();
      setData(data);
    } catch (error) {
      // @ts-expect-error the error is an instance of Error
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchData,
    data,
    loading,
    error,
  };
};

