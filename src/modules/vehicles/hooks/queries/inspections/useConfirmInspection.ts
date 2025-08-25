import { VehicleInspectionService } from "@/modules/vehicles/services";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";

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
      queryClient.invalidateQueries({ queryKey: ["vehicle-inspections"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    ConfirmInspectionMutacion,
  };
}
