import { VehicleRevenueProjectionByBranchHistory } from '../../models';
import { VehicleRevenueProjectionService } from '../../services/vehicle-revenue-projection-service';
import { useQuery } from '@tanstack/react-query';

export const useGetVehicleRevenueProjectionByBranchHistoryQuery = (
  startDate: string,
  endDate: string,
) => {
  const getVehicleRevenueProjectionByBranchHistoryQuery = useQuery<
    VehicleRevenueProjectionByBranchHistory[]
  >({
    queryKey: ['vehicle-revenue-projection-branch-history', startDate, endDate],
    queryFn: () =>
      VehicleRevenueProjectionService.getProjectionByBranchHistory(
        startDate,
        endDate,
      ),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!startDate && !!endDate,
  });

  return {
    getVehicleRevenueProjectionByBranchHistoryQuery,
  };
};

