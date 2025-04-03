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

  const travelsUnloadingQuery = useQuery<Travel[]>({
    queryKey: [mainKey, 'unloading', branchId],
    queryFn: () => TravelServiceApi.getUnloadingTravels(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  const travelsInPlantQuery = useQuery<Travel[]>({
    queryKey: [mainKey, 'in-plant', branchId],
    queryFn: () => TravelServiceApi.getTravelsInPlant(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  return {
    travelsNearQuery,
    travelsUnloadingQuery,
    travelsInPlantQuery
  };
};

