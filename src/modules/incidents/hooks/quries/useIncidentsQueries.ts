import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import type { Incident } from '../../models';
import { IncidentsService } from '../../services';

export const DRIVER_INCIDENTS_KEY = 'driver-incidents';

interface Config {
  driverId?: number;
  startDate?: string;
  endDate?: string;
}

export const useIncidentsQueries = ({ driverId, startDate, endDate }: Config) => {

  const queryClient = useQueryClient();

  const incidentsQuery = useQuery<Incident[]>({
    queryKey: [DRIVER_INCIDENTS_KEY, startDate, endDate],
    queryFn: () => IncidentsService.getAllIncidents(startDate, endDate),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const createIncident = useMutation({
    mutationFn: IncidentsService.createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries<Incident[]>({
        queryKey: [DRIVER_INCIDENTS_KEY],
        exact: false,
      });
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

  const updateIncident = useMutation({
    mutationFn: IncidentsService.updateIncident,
    onSuccess: () => {
      queryClient.invalidateQueries<Incident[]>({
        queryKey: [DRIVER_INCIDENTS_KEY],
        exact: false,
      });
      if (driverId) {
        queryClient.invalidateQueries({
          queryKey: [DRIVER_INCIDENTS_KEY, driverId],
        });
      }
      toast.success('Incidencia actualizada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    incidentsQuery,
    createIncident,
    updateIncident,
  };
};

