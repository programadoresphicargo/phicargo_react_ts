import type { WaybillStats } from '../models/waybill-stats-model';
import { WaybillStatsService } from '../services/waybill-stats-service';
import { useDateRangeContext } from './useDateRangeContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const waybillStatsKey = 'waybillStats';

export const useWaybillStatsQueries = () => {
  // const queryClient = useQueryClient();
  const { monthString, companyId, branchId } = useDateRangeContext();
  const { pathname } = useLocation();

  const waybillStatsQuery = useQuery<WaybillStats>({
    queryKey: [
      waybillStatsKey,
      monthString?.start,
      monthString?.end,
      companyId,
      branchId,
    ],
    queryFn: () =>
      WaybillStatsService.getWaybillStats(
        monthString!.start,
        monthString!.end,
        companyId,
        branchId,
      ),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!monthString && pathname === '/dashboards/finanzas',
  });

  return {
    waybillStatsQuery,
  };
};

