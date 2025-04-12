import { useMutation, useQueryClient } from '@tanstack/react-query';

import { POSTURAS_VEHICLE_KEY } from '../queries';
import type { Postura } from '../../models';
import { PosturasService } from '../../services';
import toast from 'react-hot-toast';

export const useCreatePosturaMutation = () => {
  const queryClient = useQueryClient();

  const createPosturaMutation = useMutation({
    mutationFn: PosturasService.createPostura,
    onSuccess: (data) => {
      queryClient.setQueryData<Postura[]>(
        [POSTURAS_VEHICLE_KEY, data.vehicleId],
        (prev) => {
          return prev ? [data, ...prev] : [data];
        },
      );
      toast.success('Postura creada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createPosturaMutation,
  };
};

