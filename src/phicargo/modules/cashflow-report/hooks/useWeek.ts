import WeekServiceApi from '../services/week-service';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useWeekContext } from './useWeekContext';

/**
 * Custom hook para cambiar la semana activa
 * @returns Mutación para cambiar la semana activa
 */
export const useWeek = () => {
  const { onChangeWeek } = useWeekContext();

  const changeWeekMutation = useMutation({
    mutationFn: WeekServiceApi.changeWeek,
    onSuccess: (id) => {
      onChangeWeek(id);
    },
    onError: () => {
      toast.error('Error al crear la semana');
    },
  });

  return {
    changeWeekMutation,
  };
};
