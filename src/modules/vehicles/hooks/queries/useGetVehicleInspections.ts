import { useQuery } from '@tanstack/react-query';
import type { VehicleInspection } from '../../models';
import { VehicleInspectionService } from '../../services';

export const VEHICLE_INSPECTION_QUERY_KEY = 'vehicles-inspections';

export const useGetVehicleInspections = (month: number, year: number) => {
  const query = useQuery<VehicleInspection[]>({
    queryKey: [VEHICLE_INSPECTION_QUERY_KEY, month, year],
    queryFn: () => VehicleInspectionService.getVehicleInspections(month, year),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: month > 0 && year > 0
  });

  return {
    query,
  };
};

