import WeekServiceApi from '../services/week-service';
import { getPreviousWeekRange } from '../utils/get-previous-week-range';
import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { useCollectRegisters } from './useCollectRegisters';
import { useLocation } from 'react-router-dom';
import { usePayments } from './usePayments';
import { useWeekContext } from './useWeekContext';

export const useLoadPrevious = () => {
  const { activeWeekId, weekSelected, companySelected } = useWeekContext();
  const { loadPreviousWeekPayments } = usePayments();
  const { loadPreviousWeekCollects } = useCollectRegisters();
  const location = useLocation();

  const loadPrevious = useCallback(async () => {
    if (!weekSelected || !activeWeekId) return;

    const [previousStart, previousEnd] = getPreviousWeekRange(weekSelected);

    try {
      const previousWeekId = await WeekServiceApi.changeWeek({
        startDate: previousStart,
        endDate: previousEnd,
      });

      if (!previousWeekId) return;

      const params = {
        previousWeekId,
        activeWeekId,
        companyId: companySelected,
      };

      if (location.pathname.includes('collect')) {
        loadPreviousWeekCollects.mutate(params);
      } else if (location.pathname.includes('payment')) {
        loadPreviousWeekPayments.mutate(params);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar la semana anterior');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekSelected, activeWeekId]);

  return {
    loadPrevious,
    isPending:
      loadPreviousWeekPayments.isPending || loadPreviousWeekCollects.isPending,
  };
};
