import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Trailer } from '../../models';
import { VehicleServiceApi } from '../../services';
import { useMemo } from 'react';
import type { SelectItem } from '@/types';

const mainKey = 'vehicles-trailers';

export const useGetTrailersQuery = () => {
  const getTrailersQuery = useQuery<Trailer[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getTrailers,
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

