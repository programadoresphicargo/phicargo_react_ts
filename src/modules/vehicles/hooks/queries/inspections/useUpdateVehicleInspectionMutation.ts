import odooApi from "@/api/odoo-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { VEHICLE_INSPECTION_QUERY_KEY } from "./useGetVehicleInspections";

export const useUpdateVehicleInspectionMutation = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async ({ id, data }: { id: number; data: any }) => {
   const response = await odooApi.put(`/vehicles/inspections/${id}`, data);
   return response.data;
  },

  onSuccess: (data) => {
   if (data.status === "success") {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: [VEHICLE_INSPECTION_QUERY_KEY] });
   } else {
    toast.error(data.message);
   }
  },

  onError: (err) => {
   console.error(err);
   toast.error("Error al actualizar la inspección");
  },
 });
};
