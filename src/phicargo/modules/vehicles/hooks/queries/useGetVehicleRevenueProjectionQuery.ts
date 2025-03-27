import { VehicleRevenueProjection } from '../../models';
import { VehicleRevenueProjectionService } from '../../services';
import { useQuery } from '@tanstack/react-query';

const VEHICLE_RP_KEY = 'vehicle-revenue-projection';

export const useGetVehicleRevenueProjectionQuery = () => {
  const getVehicleRevenueProjectionQuery = useQuery<VehicleRevenueProjection[]>(
    {
      queryKey: [VEHICLE_RP_KEY],
      queryFn: () =>
        VehicleRevenueProjectionService.getProjection(
          '2025-03-01',
          '2025-03-31',
        ),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
    },
  );

  return {
    getVehicleRevenueProjectionQuery,
  };
};

