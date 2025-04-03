import type { DriverBonus } from '@/modules/drivers/models';
import { DriverBonusService } from '@/modules/drivers/services';
import { useQuery } from '@tanstack/react-query';

export const DRIVER_BONUS_KEY = 'driverBonus';

export const useGetDriverBonusQuery = (
  month: number | null,
  year: number | null,
) => {
  const driverBonusQuery = useQuery<DriverBonus[]>({
    queryKey: [DRIVER_BONUS_KEY, 'period', month, year],
    queryFn: () => DriverBonusService.getDriversBonus(month!, year!),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!month && !!year,
  });

  return {
    driverBonusQuery,
  };
};

