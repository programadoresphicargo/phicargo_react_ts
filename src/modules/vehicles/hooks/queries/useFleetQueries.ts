import { useQuery } from '@tanstack/react-query';
import { Fleet } from '../../models';
import { VehicleServiceApi } from '../../services';

const FLEET_QUERY_KEY = 'vehicles-fleet';

export const useFleetQueries = () => {
  const getFleetQuery = useQuery<Fleet[]>({
    queryKey: [FLEET_QUERY_KEY],
    queryFn: () => VehicleServiceApi.getFleet(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    getFleetQuery,
  };
};

