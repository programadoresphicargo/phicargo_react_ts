import { DriverService } from '../../services';
import { Maneuver } from '../../models';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'maneuver';

interface Options {
  driverId?: number;
}

export const useManeuverQueries = ({ driverId }: Options) => {
  const maneuverByDriverQuery = useQuery<Maneuver[]>({
    queryKey: [mainKey, 'by-driver', driverId],
    queryFn: () => DriverService.getManeuversByDriverId(driverId as number),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!driverId,
  });

  return {
    maneuverByDriverQuery,
  };
};

