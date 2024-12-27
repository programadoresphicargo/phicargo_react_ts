import { Maneuver } from '../../core/models';
import ShiftServiceApi from '../services/shifts-service';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'maneuver';

interface Options {
  driverId?: number;
}

export const useManeuverQueries = ({ driverId }: Options) => {
  const maneuverByDriverQuery = useQuery<Maneuver[]>({
    queryKey: [mainKey, 'by-driver', driverId],
    queryFn: () => ShiftServiceApi.getManeuversByDriverId(driverId as number),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!driverId,
  });

  return {
    maneuverByDriverQuery,
  };
};

