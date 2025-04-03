import type { ManeuverStats } from '../models/maneuvers-stats-model';
import { ManeuverStatsService } from '../services/maneuver-stats-service';
import { useDateRangeContext } from './useDateRangeContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const MANEUVER_STATS_KEY = 'maneuverStats';

export const useManeuversStatsQueries = () => {
  // const queryClient = useQueryClient();
  const { monthString } = useDateRangeContext();
  const { pathname } = useLocation();

  const maneuversStatsQuery = useQuery<ManeuverStats>({
    queryKey: [MANEUVER_STATS_KEY, monthString?.start, monthString?.end],
    queryFn: () =>
      ManeuverStatsService.getManeuversStats(
        monthString!.start,
        monthString!.end,
      ),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!monthString && pathname === '/dashboards/maniobras',
  });

  return {
    maneuversStatsQuery,
  };
};

