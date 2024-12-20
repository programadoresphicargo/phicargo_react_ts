import type { Shift } from '../models';
import ShiftServiceApi from '../services/shifts-service';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'shifts';

interface Options {
  branchId?: number;
}

export const useShiftQueries = ({ branchId }: Options) => {
  const shiftQuery = useQuery<Shift[]>({
    queryKey: [mainKey, branchId],
    queryFn: () => ShiftServiceApi.getShifts(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  return {
    shiftQuery,
  };
};

