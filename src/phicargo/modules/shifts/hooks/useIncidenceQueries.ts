import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Incidence } from '../models/driver-incidence-model';
import IncidenceServiceApi from '../services/incidence-service';
import toast from 'react-hot-toast';

const mainKey = 'incidences';

export const useIncidenceQueries = () => {
  const queryClient = useQueryClient();

  const incidencesQuery = useQuery<Incidence[]>({
    queryKey: [mainKey],
    queryFn: IncidenceServiceApi.getAllInicences,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const createIncidence = useMutation({
    mutationFn: IncidenceServiceApi.createIncidence,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey], (prev: Incidence[]) =>
        prev ? [...prev, item] : [item],
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

