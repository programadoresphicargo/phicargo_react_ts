import type { Postura } from '../../models';
import { PosturasService } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const POSTURAS_VEHICLE_KEY = 'posturas-vehicle';

export const useGetPosturasByVehicleQuery = (vehicleId: number) => {
  const getPosturasByVehicleQuery = useQuery<Postura[]>({
    queryKey: [POSTURAS_VEHICLE_KEY, vehicleId],
    queryFn: () => PosturasService.getPosturasByVehicle(vehicleId),
  });

  return {
    getPosturasByVehicleQuery,
  };
};

