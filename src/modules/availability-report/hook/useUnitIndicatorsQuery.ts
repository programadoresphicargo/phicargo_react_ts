import type { UnitIndicators } from '../models/unit-indicators-model';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import UnitsService from '../services/units-service';

const mainKey = 'unit-indicators';
const unitsService = new UnitsService();

interface HookOptions {
  branchId: number;
}

export const useUnitIndicatorsQuery = (options: HookOptions) => {
  const { branchId } = options;

  const indicatorsQuery = useQuery<UnitIndicators>({
    queryKey: [mainKey, branchId],
    queryFn: () => unitsService.getIndicators(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<UnitIndicators>,
  });

  return {
    indicatorsQuery,
  };
};
