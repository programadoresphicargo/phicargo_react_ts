import type { VehicleStats } from '../models/vehicles-stats-models';
import { VehiclesStatsService } from '../services/vehicles-stats-service';
import { useDateRangeContext } from './useDateRangeContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const vehiclesKey = 'vehiclesStats';

export const useVehiclesStatsQueries = () => {
  // const queryClient = useQueryClient();
  const { monthString } = useDateRangeContext();
  const { pathname } = useLocation();

  const vehiclesStatsQuery = useQuery<VehicleStats>({
    queryKey: [vehiclesKey, monthString?.start, monthString?.end],
    queryFn: () =>
      VehiclesStatsService.getVehiclesStats(
        monthString!.start,
        monthString!.end,
      ),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!monthString && pathname === '/dashboards/unidades',
  });

  return {
    vehiclesStatsQuery,
  };
};

