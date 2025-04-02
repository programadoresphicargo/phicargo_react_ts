import type { DriverBonusMonth } from '../../../models';
import { DriverBonusService } from '../../../services';
import { useQuery } from '@tanstack/react-query';

const DRIVER_BONUS_KEY = 'driverBonus';

export const useDriverBonusQueries = () => {
  const driverBonusMonthsQuery = useQuery<DriverBonusMonth[]>({
    queryKey: [DRIVER_BONUS_KEY, 'months'],
    queryFn: () => DriverBonusService.getDriverBonusMonths(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    driverBonusMonthsQuery,
  };
};
