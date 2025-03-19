import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for debouncing a value
 * @param value String value to debounce
 * @param delay Time to wait before updating the value
 * @returns Value debounced
 */
export const useDebounce = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const timerRef = useRef<number>();

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay) as unknown as number;

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
};

