import { DateRangeContext } from '../context/DateRangeContext';
import { useContext } from 'react';

export const useDateRangeContext = () => {
  const context = useContext(DateRangeContext);

  return {
    ...context,
  };
};

