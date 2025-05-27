import type { Incident } from '../../models';
import { IncidentsService } from '../../services';
import { driverIncidentsKey } from './useIncidentsQueries';
import { useQuery } from '@tanstack/react-query';

export const useGetDriverIncidents = (driverId: number) => {
  const driverIncidents = useQuery<Incident[]>({
    queryKey: [driverIncidentsKey, driverId],
    queryFn: () => IncidentsService.getIncidentsByDriver(driverId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    driverIncidents,
  };
};

