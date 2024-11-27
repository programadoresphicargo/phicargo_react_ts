import type { Vehicle } from '../models/vehicle-model';

import VehicleServiceApi from '../services/vehicle-service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const mainKey = 'vehicles';

export const useVehicleQueries = () => {
  const vehicleQuery = useQuery<Vehicle[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getVehicles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<Vehicle[]>,
  });

  return {
    vehicleQuery,
  };
};

