import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Trailer } from '../../models';
import { VehicleServiceApi } from '../../services';
import { useMemo } from 'react';
import type { SelectItem } from '@/types';

export const TRAILERS_QUERY_KEY = 'vehicles-trailers';

export const useGetTrailersQuery = (fleetType: 'trailer' | 'dolly' = 'trailer') => {
  const getTrailersQuery = useQuery<Trailer[]>({
    queryKey: [TRAILERS_QUERY_KEY, fleetType],
    queryFn: () => VehicleServiceApi.getTrailers(fleetType),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData<Trailer[]>,
  });

  const trailerOptions = useMemo<SelectItem[]>(
    () =>
      (getTrailersQuery.data ?? []).map((trailer) => ({
        key: trailer.id,
        value: trailer.name,
      })),
    [getTrailersQuery.data],
  );

  return {
    getTrailersQuery,
    trailerOptions,
    isLoading: getTrailersQuery.isLoading,
  };
};

