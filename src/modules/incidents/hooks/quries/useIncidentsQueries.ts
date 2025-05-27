import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import type { Incident } from '../../models';
import { IncidentsService } from '../../services';

export const driverIncidentsKey = 'driver-incidents';

export const useIncidentsQueries = () => {
  const queryClient = useQueryClient();

  const incidentsQuery = useQuery<Incident[]>({
    queryKey: [driverIncidentsKey],
    queryFn: IncidentsService.getAllIncidents,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const createIncident = useMutation({
    mutationFn: IncidentsService.createIncident,
    onSuccess: (item) => {
      queryClient.setQueryData(
        [driverIncidentsKey, item.driver.id],
        (prev: Incident[]) => (prev ? [item, ...prev] : [item]),
      );
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

