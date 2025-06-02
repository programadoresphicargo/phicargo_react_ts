import type { Incident } from '../../models';
import { IncidentsService } from '../../services';
import { useQuery } from '@tanstack/react-query';
import { DRIVER_INCIDENTS_KEY } from './useIncidentsQueries';

export const useGetDriverIncidents = (driverId: number) => {
  const driverIncidents = useQuery<Incident[]>({
    queryKey: [DRIVER_INCIDENTS_KEY, driverId],
    queryFn: () => IncidentsService.getIncidentsByDriver(driverId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    driverIncidents,
  };
};

