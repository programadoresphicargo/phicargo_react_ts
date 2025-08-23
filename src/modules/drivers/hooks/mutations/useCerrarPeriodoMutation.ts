import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DRIVER_BONUS_KEY } from '../queries';
import { DriverBonusService } from '../../services';
import toast from 'react-hot-toast';

export const useCerrarPeriodoMutation = (
  id_periodo: number | null,
) => {
  const queryClient = useQueryClient();

  const CerrarPeriodoMutation = useMutation({
    mutationFn: DriverBonusService.cerrarPeriodo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [DRIVER_BONUS_KEY, id_periodo],
      });
      if (data.status == 'success') {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    CerrarPeriodoMutation,
  };
};

