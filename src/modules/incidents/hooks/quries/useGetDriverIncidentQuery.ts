import { useQuery } from '@tanstack/react-query';
import type { Incident } from '../../models';
import { DRIVER_INCIDENTS_KEY } from './useIncidentsQueries';
import { IncidentsService } from '../../services';

export const useGetDriverIncidentQuery = (incidentId: number) => {
  const query = useQuery<Incident>({
    queryKey: [DRIVER_INCIDENTS_KEY, incidentId],
    queryFn: () => IncidentsService.getIncidentById(incidentId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!incidentId,
  });

  return {
    query,
  };
};

