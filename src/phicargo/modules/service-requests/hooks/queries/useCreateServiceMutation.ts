import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SERVICE_REQUESTS_QUERY_KEY } from './useGetServices';
import { WaybillService } from '../../services';
import { toast } from 'react-toastify';

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();

  const createServiceMutation = useMutation({
    mutationFn: WaybillService.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SERVICE_REQUESTS_QUERY_KEY],
        exact: false,
      });
      toast.success('Servicio creado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createServiceMutation,
  };
};

