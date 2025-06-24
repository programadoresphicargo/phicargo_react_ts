import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VehicleInspectionService } from '../../services';
import toast from 'react-hot-toast';
import { VEHICLE_INSPECTION_QUERY_KEY } from '../queries';

export const useCreateVehicleInspectionMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: VehicleInspectionService.createVehicleInspection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VEHICLE_INSPECTION_QUERY_KEY],
        exact: false,
      });
      toast.success('Inspección creada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    mutation,
  };
};

