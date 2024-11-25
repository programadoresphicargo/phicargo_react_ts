import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { VehicleRead } from '../models/vehicle-model';
import VehicleServiceApi from '../services/vehicle-service';

const mainKey = 'vehicles';

export const useVehicleQueries = () => {
  const vehiclesReadQuery = useQuery<VehicleRead[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getVehiclesRead,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<VehicleRead[]>,
  });

  const vehiclesOptions = useMemo(
    () =>
      (vehiclesReadQuery.data || []).map((vehicle) => ({
        id: vehicle.id,
        label: vehicle.name,
      })),
    [vehiclesReadQuery.data],
  );

  return {
    vehicles: vehiclesReadQuery.data || [],
    vehiclesOptions,
    vehiclesReadQuery,
  };
};
