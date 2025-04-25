import { AvailabilityService } from '../services';
import type { DateRange } from 'rsuite/esm/DateRangePicker';
import type { Record } from '../models';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'records';

export const useRecordsQuery = (month: DateRange, branchId: number) => {
  const recordsQuery = useQuery<Record[]>({
    queryKey: [mainKey, month, branchId],
    queryFn: () => AvailabilityService.getRecords(month, branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
    enabled: !!month && !!branchId,
  });

  return {
    recordsQuery,
  };
};

