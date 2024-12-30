import type { Travel } from '../models/travels-models';
import TravelServiceApi from '../services/travels-service';
import { useQuery } from '@tanstack/react-query';
import { useShiftsContext } from './useShiftsContext';

const mainKey = 'travels';

export const useTravelQueries = () => {
  const { branchId } = useShiftsContext();

  const travelsNearQuery = useQuery<Travel[]>({
    queryKey: [mainKey, 'near', branchId],
    queryFn: () => TravelServiceApi.getTravelsNearToBranch(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  return {
    travelsNearQuery,
  };
};

