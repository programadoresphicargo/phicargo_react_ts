import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Trailer } from '../../models';
import { VehicleServiceApi } from '../../services';

const mainKey = 'vehicles-trailers';

export const useGetTrailersQuery = () => {
  const getTrailersQuery = useQuery<Trailer[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getTrailers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData<Trailer[]>,
  });

  return {
    getTrailersQuery,
  };
};

