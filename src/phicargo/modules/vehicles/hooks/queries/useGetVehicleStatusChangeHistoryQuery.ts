import { VehicleServiceApi } from '../../services';
import type { VehicleStatusChangeEvent } from '../../models';
import { useQuery } from '@tanstack/react-query';

const VEHICLE_SCH_KEY = 'vehicle-status-change-history';

export const useGetVehicleStatusChangeHistoryQuery = (vehicleId: number, enable=true) => {
  const getVehicleStatusChangeHistory = useQuery<VehicleStatusChangeEvent[]>({
    queryKey: [VEHICLE_SCH_KEY, vehicleId],
    queryFn: () => VehicleServiceApi.getStatusChangeHistoryByVehicle(vehicleId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: enable,
  });

  return {
    getVehicleStatusChangeHistory,
  };
};

