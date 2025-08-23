import type { DriverBonus } from '@/modules/drivers/models';
import { DriverBonusService } from '@/modules/drivers/services';
import { useQuery } from '@tanstack/react-query';

export const DRIVER_BONUS_KEY = 'driverBonus';

export const useGetDriverBonusQuery = (
  id_periodo: number | null,
) => {
  const driverBonusQuery = useQuery<DriverBonus[]>({
    queryKey: [DRIVER_BONUS_KEY, 'period', id_periodo],
    queryFn: () => DriverBonusService.getDriversBonus(id_periodo!),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!id_periodo,
  });

  return {
    driverBonusQuery,
  };
};

