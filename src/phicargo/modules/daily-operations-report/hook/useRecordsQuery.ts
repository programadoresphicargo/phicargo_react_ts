import type { DateRange } from 'rsuite/esm/DateRangePicker';
import type { Record } from '../models/record-model';
import RecordService from '../services/record-service';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'records';
const recordService = new RecordService();

export const useRecordsQuery = (month: DateRange, branchId: number) => {
  const recordsQuery = useQuery<Record[]>({
    queryKey: [mainKey, month, branchId],
    queryFn: () => recordService.getRecords(month, branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
    enabled: !!month && !!branchId,
  });

  return {
    recordsQuery,
  };
};
