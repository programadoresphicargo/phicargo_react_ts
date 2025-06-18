import { useQuery } from '@tanstack/react-query';
import type { VehicleInspection } from '../../models';
import { VehicleInspectionService } from '../../services';

const VEHICLE_INSPECTION_QUERY_KEY = 'vehicles-inspections';

export const useGetVehicleInspections = () => {
  const query = useQuery<VehicleInspection[]>({
    queryKey: [VEHICLE_INSPECTION_QUERY_KEY],
    queryFn: () => VehicleInspectionService.getVehicleInspections(6, 2025),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    query,
  };
};

