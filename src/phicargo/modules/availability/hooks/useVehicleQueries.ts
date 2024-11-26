import { Vehicle, VehicleWithTravelRef } from '../models/vehicle-model';

import VehicleServiceApi from '../services/vehicle-service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const mainKey = 'vehicles';

export const useVehicleQueries = () => {
  const vehiclesWithTravelRefQuery = useQuery<VehicleWithTravelRef[]>({
    queryKey: [mainKey, 'with_travel_reference'],
    queryFn: VehicleServiceApi.getVehiclesWithTravelRef,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<VehicleWithTravelRef[]>,
  });

  const vehicleQuery = useQuery<Vehicle[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getVehicles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<Vehicle[]>
  });

  return {
    vehiclesWithTravelRefQuery,
    vehicleQuery,
  };
};

