import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VehicleServiceApi } from '../../services';
import toast from 'react-hot-toast';
import { TRAILERS_QUERY_KEY } from '../queries';

export const useTrailerDriverAssignmentMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: VehicleServiceApi.trailerDriverAssignment,
    onSuccess: () => {
      toast.success('Remolque asignado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [TRAILERS_QUERY_KEY],
        exact: false,
      });
    },
  });

  return {
    trailerDriverAssignmentMutation: mutation,
  };
};

