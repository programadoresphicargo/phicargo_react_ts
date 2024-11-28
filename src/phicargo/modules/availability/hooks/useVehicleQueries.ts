import type { Vehicle } from '../models/vehicle-model';

import VehicleServiceApi from '../services/vehicle-service';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const mainKey = 'vehicles';

export const useVehicleQueries = () => {
  const vehicleQuery = useQuery<Vehicle[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getVehicles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<Vehicle[]>,
  });

  const vehicleUpdateMutation = useMutation({
    mutationFn: VehicleServiceApi.updateVehicle,
    onSuccess: () => {
      toast.success('Actualizado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    vehicles: vehicleQuery.data || [],
    vehicleQuery,
    vehicleUpdateMutation
  };
};

