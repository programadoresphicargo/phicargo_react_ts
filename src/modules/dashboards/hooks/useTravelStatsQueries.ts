import type { TravelStats } from '../models/travels-stats-models';
import TravelStatsServiceApi from '../services/travel-stats-service';
import { useDateRangeContext } from './useDateRangeContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const travelKey = 'travelStats';

export const useTravelStatsQueries = () => {
  // const queryClient = useQueryClient();
  const { monthString, companyId, branchId } = useDateRangeContext();
  const { pathname } = useLocation();

  const travelStatsQuery = useQuery<TravelStats>({
    queryKey: [travelKey, monthString?.start, monthString?.end, companyId, branchId],
    queryFn: () =>
      TravelStatsServiceApi.getTravelStats(
        monthString!.start,
        monthString!.end,
        companyId,
        branchId,
      ),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!monthString && pathname === '/dashboards/operaciones',
  });

  return {
    travelStatsQuery,
  };
};

