import WeekServiceApi from '../services/week-service';
import { getPreviousWeekRange } from '../utils/get-previous-week-range';
import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { useCollectRegisters } from './useCollectRegisters';
import { usePayments } from './usePayments';
import { useWeekContext } from './useWeekContext';

export const useLoadPrevious = () => {
  const { activeWeekId, weekSelected } = useWeekContext();
  const { loadPreviousWeekPayments } = usePayments();
  const { loadPreviousWeekCollects } = useCollectRegisters();

  const loadPrevious = useCallback(async () => {
    if (!weekSelected || !activeWeekId) return;

    const [previousStart, previousEnd] = getPreviousWeekRange(weekSelected);

    try {
      const previousWeekId = await WeekServiceApi.changeWeek({
        startDate: previousStart,
        endDate: previousEnd,
      });

      if (!previousWeekId) return;

      const params = { previousWeekId, activeWeekId };
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar la semana anterior');
    }
  }, [weekSelected, activeWeekId]);

  return {
    loadPrevious,
    isPending:
      loadPreviousWeekPayments.isPending || loadPreviousWeekCollects.isPending,
  };
};
