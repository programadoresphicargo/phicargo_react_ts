import { useEffect, useState } from 'react';

const loadFromSessionStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = sessionStorage.getItem(key);
    return storedValue !== null ? (JSON.parse(storedValue) as T) : defaultValue;
  } catch (error) {
    console.error(`Error parsing sessionStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const useSessionStorage = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() =>
    loadFromSessionStorage(key, defaultValue),
  );

  useEffect(() => {
    const storedValue = sessionStorage.getItem(key);
    const parsedValue = storedValue ? JSON.parse(storedValue) : defaultValue;

    if (JSON.stringify(parsedValue) !== JSON.stringify(state)) {
      sessionStorage.setItem(key, JSON.stringify(state));
    }
  }, [defaultValue, key, state]);

  return [state, setState] as const;
};

