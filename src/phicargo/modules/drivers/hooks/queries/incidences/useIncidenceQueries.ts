import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Incidence } from '../../../models';
import { IncidenceServiceApi } from '../../../services';
import toast from 'react-hot-toast';

export const driverIncidencesKey = 'driver-incidences';

export const useIncidenceQueries = () => {
  const queryClient = useQueryClient();

  const incidencesQuery = useQuery<Incidence[]>({
    queryKey: [driverIncidencesKey],
    queryFn: IncidenceServiceApi.getAllInicences,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const createIncidence = useMutation({
    mutationFn: IncidenceServiceApi.createIncidence,
    onSuccess: (item) => {
      queryClient.setQueryData([driverIncidencesKey, item.driver.id], (prev: Incidence[]) =>
        prev ? [item, ...prev] : [item],
      );
      toast.success('Incidencia creada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    incidencesQuery,
    createIncidence,
  };
};

