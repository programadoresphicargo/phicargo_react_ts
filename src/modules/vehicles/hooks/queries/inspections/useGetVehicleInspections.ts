import type { InspectionType, VehicleInspection } from '@/modules/vehicles/models';
import { VehicleInspectionService } from '@/modules/vehicles/services';
import { useQuery } from '@tanstack/react-query';


export const VEHICLE_INSPECTION_QUERY_KEY = 'vehicles-inspections';

export const useGetVehicleInspections = (month: number, year: number, inspectionType: InspectionType = 'cleaning') => {
  const query = useQuery<VehicleInspection[]>({
    queryKey: [VEHICLE_INSPECTION_QUERY_KEY, month, year, inspectionType],
    queryFn: () => VehicleInspectionService.getVehicleInspections(month, year, inspectionType),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: month > 0 && year > 0
  });

  return {
    query,
  };
};

