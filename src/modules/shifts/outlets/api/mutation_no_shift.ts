import { useMutation } from "@tanstack/react-query";
import { AsignacionViajePayload, } from "./asignacionViaje";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { postAsignacionViajeSinTurno } from "./asignacionViajeNoTurno";

interface AsignarViajeVars {
 payload: AsignacionViajePayload;
}

interface ApiError {
 detail: string;
}

export const useAsignarViajeSinTurno = () => {
 return useMutation({
  mutationFn: ({ payload }: AsignarViajeVars) =>
   postAsignacionViajeSinTurno(payload),
  onSuccess: (data) => {
   toast.success(data.message);
  },
  onError: (error: AxiosError<ApiError>) => {
   const message =
    error.response?.data?.detail ?? "Error desconocido";
   toast.error(message);
  },
 });
};

