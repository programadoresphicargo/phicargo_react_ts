import type { Incidence } from '../../../models';
import { IncidenceServiceApi } from '../../../services';
import { driverIncidencesKey } from './useIncidenceQueries';
import { useQuery } from '@tanstack/react-query';

export const useGetDriverIncidence = (driverId: number) => {
  const driverIncidences = useQuery<Incidence[]>({
    queryKey: [driverIncidencesKey, driverId],
    queryFn: () => IncidenceServiceApi.getInicencesByDriver(driverId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    driverIncidences,
  };
};

