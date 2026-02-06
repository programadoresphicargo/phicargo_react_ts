import { AvailabilityService } from '../services';
import type { Record } from '../models';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { DateRange } from 'rsuite/esm/DateRangePicker/types';

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

export const useSendReportEmail = () => {
  const mutation = useMutation({
    mutationFn: ({ month, branchId }: { month: DateRange; branchId: number }) =>
      AvailabilityService.sendReportEmail(month, branchId),
  });

  return {
    sendReportEmail: mutation.mutate,
    sendReportEmailAsync: mutation.mutateAsync,
    ...mutation,
  };
};