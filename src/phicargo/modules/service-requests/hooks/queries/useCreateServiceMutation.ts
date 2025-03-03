import { WaybillService } from '../../services';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

export const useCreateServiceMutation = () => {
  const createServiceMutation = useMutation({
    mutationFn: WaybillService.createService,
    onSuccess: () => {
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

