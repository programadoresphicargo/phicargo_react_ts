// hooks/useAsignarViaje.ts
import { useMutation } from "@tanstack/react-query";
import { AsignacionViajePayload, postAsignacionViaje } from "./asignacionViaje";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface AsignarViajeVars {
 shiftId: number;
 payload: AsignacionViajePayload;
}

interface ApiSuccessResponse {
 status: string;
 menssage: string;
}

interface ApiError {
 detail: string;
}

export const useAsignarViaje = () => {
 return useMutation({
  mutationFn: ({ shiftId, payload }: AsignarViajeVars) =>
   postAsignacionViaje(shiftId, payload),
  onSuccess: (data) => {
   toast.success(data.menssage);
  },
  onError: (error: AxiosError<ApiError>) => {
   toast.error("Error completo:" + error);

   const message =
    error.response?.data?.detail ?? "Error desconocido";

   toast.error("Error" + message);
  },
 });
};

