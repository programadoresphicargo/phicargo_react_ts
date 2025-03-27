import type { VehicleRevenueProjection } from '../../models';
import { VehicleRevenueProjectionService } from '../../services';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useVehicleRevenueProjectionContext } from '../useVehicleRevenueProjectionContext';

const VEHICLE_RP_KEY = 'vehicle-revenue-projection';

export const useGetVehicleRevenueProjectionQuery = () => {
  const { month } = useVehicleRevenueProjectionContext();

  const startDate =
    month && month[0] ? dayjs(month[0]).format('YYYY-MM-DD') : '2025-03-01';
  const endDate =
    month && month[1] ? dayjs(month[1]).format('YYYY-MM-DD') : '2025-03-31';

  const getVehicleRevenueProjectionQuery = useQuery<VehicleRevenueProjection[]>(
    {
      queryKey: [VEHICLE_RP_KEY, startDate, endDate],
      queryFn: () =>
        VehicleRevenueProjectionService.getProjection(startDate, endDate),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      enabled: !!month,
    },
  );

  return {
    getVehicleRevenueProjectionQuery,
  };
};

