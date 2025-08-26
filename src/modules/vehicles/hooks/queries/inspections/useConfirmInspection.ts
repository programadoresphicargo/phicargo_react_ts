import { VehicleInspectionService } from "@/modules/vehicles/services";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { VEHICLE_INSPECTION_QUERY_KEY } from "..";

export const useConfirmInspectionMutation = (inspectionId?: number) => {
  const queryClient = useQueryClient();

  const ConfirmInspectionMutacion = useMutation({
    mutationFn: () => VehicleInspectionService.confirmInspection(inspectionId!),
    onSuccess: (data) => {
      if (data.status == 'success') {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: [VEHICLE_INSPECTION_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    ConfirmInspectionMutacion,
    isLoadingConfirm: ConfirmInspectionMutacion.isPending,
  };
}
