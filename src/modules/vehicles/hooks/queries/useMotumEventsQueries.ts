import { VehicleServiceApi } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const useMotumEventsQueries = () => {
  const getMotumEventsQuery = useQuery({
    queryKey: ['motum-events'],
    queryFn: () => VehicleServiceApi.getMotumEvents(),
  });

  return {
    getMotumEventsQuery,
  };
};

