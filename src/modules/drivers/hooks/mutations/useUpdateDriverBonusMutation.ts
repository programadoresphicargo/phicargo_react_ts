import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DRIVER_BONUS_KEY } from '../queries';
import { DriverBonusService } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateDriverBonusMutation = (
  id_periodo: number | null,
) => {
  const queryClient = useQueryClient();

  const updateDriverBonusMutation = useMutation({
    mutationFn: DriverBonusService.updateDriverBonus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DRIVER_BONUS_KEY, id_periodo],
      });
      toast.success('Bonos actualizados correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    updateDriverBonusMutation,
  };
};

