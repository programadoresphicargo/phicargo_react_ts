import { ShiftsContext } from '../context/ShiftsContext';
import { useContext } from 'react';

export const useShiftsContext = () => {
  const context = useContext(ShiftsContext);

  return {
    ...context,
  };
};

