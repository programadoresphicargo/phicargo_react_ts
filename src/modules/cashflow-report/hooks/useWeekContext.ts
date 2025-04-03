import { WeekContext } from '../context/week-context/WeekContext';
import { useContext } from 'react';

/**
 * Hook para obtener el contexto de la aplicación
 * @returns Objeto con el contexto de la aplicación
 */
export const useWeekContext = () => {
  const context = useContext(WeekContext);

  return {
    ...context,
  };
};
