import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SERVICE_REQUESTS_QUERY_KEY } from './useGetServices';
import { WaybillService } from '../../services';
import toast from 'react-hot-toast';

export const useEditServiceMutation = () => {
  const queryClient = useQueryClient();

  const editServiceMutation = useMutation({
    mutationFn: WaybillService.updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SERVICE_REQUESTS_QUERY_KEY],
        exact: false,
      });
      toast.success('Servicio actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    editServiceMutation,
  };
};

