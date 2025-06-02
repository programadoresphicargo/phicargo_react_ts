import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import type { Incident } from '../../models';
import { IncidentsService } from '../../services';

export const DRIVER_INCIDENTS_KEY = 'driver-incidents';

export const useIncidentsQueries = (driverId?: number) => {
  const queryClient = useQueryClient();

  const incidentsQuery = useQuery<Incident[]>({
    queryKey: [DRIVER_INCIDENTS_KEY],
    queryFn: IncidentsService.getAllIncidents,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const createIncident = useMutation({
    mutationFn: IncidentsService.createIncident,
    onSuccess: (item) => {
      queryClient.setQueryData(
        [DRIVER_INCIDENTS_KEY],
        (prev: Incident[]) => (prev ? [item, ...prev] : [item]),
      );
      if (driverId) {
        queryClient.invalidateQueries({
          queryKey: [DRIVER_INCIDENTS_KEY, driverId],
        });
      }
      toast.success('Incidencia creada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    incidentsQuery,
    createIncident,
  };
};

