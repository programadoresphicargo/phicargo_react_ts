import { Vehicle, VehicleWithDriver, VehicleWithTravelRef } from '../models/vehicle-model';

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

  const vehicleWithDriverQuery = useQuery<VehicleWithDriver[]>({
    queryKey: [mainKey, 'with_driver'],
    queryFn: VehicleServiceApi.getVehiclesWithDriver,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<VehicleWithDriver[]>
  })

  return {
    vehiclesWithTravelRefQuery,
    vehicleWithDriverQuery,
    vehicleQuery,
  };
};

