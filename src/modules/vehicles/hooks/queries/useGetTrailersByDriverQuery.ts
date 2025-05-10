import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Trailer } from '../../models';
import { VehicleServiceApi } from '../../services';
import { TRAILERS_QUERY_KEY } from './useGetTrailersQuery';

export const useGetTrailersByDriverQuery = (driverId: number) => {
  const getTrailersByDriverQuery = useQuery<Trailer[]>({
    queryKey: [TRAILERS_QUERY_KEY, 'driver', driverId],
    queryFn: () => VehicleServiceApi.getTrailersByDriver(driverId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData<Trailer[]>,
    enabled: !!driverId,
  });

  return {
    getTrailersByDriverQuery,
  };
};

