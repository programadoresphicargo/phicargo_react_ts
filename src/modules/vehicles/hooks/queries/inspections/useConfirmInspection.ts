import { VehicleInspectionService } from "@/modules/vehicles/services";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { VEHICLE_INSPECTION_QUERY_KEY } from "..";

interface ChangeStateParams {
  inspectionId: number;
  state: string;
}

export const useChangeStateInspectionMutation = () => {
  const queryClient = useQueryClient();

  // 2️⃣ Tipamos useMutation para aceptar ChangeStateParams
  const ChangeStateInspectionMutacion = useMutation({
    mutationFn: ({ inspectionId, state }: ChangeStateParams) =>
      VehicleInspectionService.ChangeStateInspection(inspectionId, state),

    onSuccess: (data) => {
      if (data.status === "success") {
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
    ChangeStateInspectionMutacion,
    isLoadingConfirm: ChangeStateInspectionMutacion.isPending,
  };
};