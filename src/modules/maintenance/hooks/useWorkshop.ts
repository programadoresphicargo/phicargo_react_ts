import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Workshop } from '../models';
import WorkshopServiceApi from '../services/workshop-service';
import toast from 'react-hot-toast';

const mainKey = 'workshops';

export const useWorkshop = () => {
  const queryClient = useQueryClient();

  const workshopQuery = useQuery<Workshop[]>({
    queryKey: [mainKey],
    queryFn: WorkshopServiceApi.getWorkshops,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const addWorkshopMutation = useMutation({
    mutationFn: WorkshopServiceApi.addWorkshop,
    onSuccess: (newWorkshop) => {
      queryClient.setQueryData([mainKey], (prev: Workshop[]) => [
        newWorkshop,
        ...prev,
      ]);
      toast.success('Taller creado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    workshopQuery,
    addWorkshopMutation,
  };
};
