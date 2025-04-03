import type { DriverStats } from '../models/driver-stats-models';
import { DriverStatsService } from '../services/driver-stats-service';
import { useDateRangeContext } from './useDateRangeContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const driverStatsKey = 'driversStats';

export const useDriverStatsQueries = () => {
  // const queryClient = useQueryClient();
  const { monthString } = useDateRangeContext();
  const { pathname } = useLocation();

  const driversStatsQuery = useQuery<DriverStats>({
    queryKey: [driverStatsKey, monthString?.start, monthString?.end],
    queryFn: () =>
      DriverStatsService.getDriverStats(monthString!.start, monthString!.end),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!monthString && pathname === '/dashboards/operadores',
  });

  return {
    driversStatsQuery,
  };
};

