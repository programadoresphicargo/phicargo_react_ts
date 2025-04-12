import { useMutation, useQueryClient } from '@tanstack/react-query';

import { POSTURAS_VEHICLE_KEY } from '../queries';
import type { Postura } from '../../models';
import { PosturasService } from '../../services';
import toast from 'react-hot-toast';

export const useFinishPosturaMutation = () => {
  const queryClient = useQueryClient();

  const finishPosturaMutation = useMutation({
    mutationFn: PosturasService.finishPostura,
    onSuccess: (data) => {
      queryClient.setQueryData<Postura[]>(
        [POSTURAS_VEHICLE_KEY, data.vehicleId],
        (prev) => prev?.map((p) => (p.id === data.id ? data : p)) || [],
      );
      toast.success('Postura finalizada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    finishPosturaMutation,
  };
};

