import { VehicleInspectionQuestion } from "@/modules/vehicles/models";
import { VehicleInspectionService } from "@/modules/vehicles/services";
import { useQuery } from "@tanstack/react-query";
import { VEHICLE_INSPECTION_QUERY_KEY } from "./useGetVehicleInspections";

export const useGetInspectionChecklistQuery = (inspectionId?: number) => {
  const query = useQuery<VehicleInspectionQuestion[]>({
    queryKey: [VEHICLE_INSPECTION_QUERY_KEY, inspectionId, 'checklist'],
    queryFn: () => VehicleInspectionService.getChecklistByInspectionId(inspectionId!),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!inspectionId,
  });

  return {
    query,
  };
}
