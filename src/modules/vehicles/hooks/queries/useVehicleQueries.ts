import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Vehicle } from '../../models';
import { VehicleServiceApi } from '../../services';

const mainKey = 'vehicles';

export const useVehicleQueries = () => {
  const queryClient = useQueryClient();
  const vehicleQuery = useQuery<Vehicle[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getVehicles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData<Vehicle[]>,
  });

  const vehicleUpdateMutation = useMutation({
    mutationFn: VehicleServiceApi.updateVehicle,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey], (prev?: Vehicle[]) =>
        prev?.map((d) => (d.id === item.id ? item : d)),
      );
      toast.success('Actualizado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    vehicles: vehicleQuery.data || [],
    vehicleQuery,
    vehicleUpdateMutation,
  };
};

