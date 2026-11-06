import { useState } from "react";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";

export type EstadoDescuento =
 | "borrador"
 | "confirmado"
 | "aplicado"
 | "cancelado";

export const useDescuento = () => {

 const [isLoading, setLoading] = useState(false);

 const cambiarEstado = async (
  id: number,
  estado: EstadoDescuento
 ) => {
  try {
   setLoading(true);

   const response = await odooApi.patch(
    `/descuentos/state/${id}`,
    null,
    {
     params: { state: estado },
    }
   );

   if (response.data.status !== "success") {
    toast.error(response.data.message);
    return false;
   }

   toast.success(response.data.message);
   return true;

  } catch (error: any) {
   toast.error(
    error.response?.data?.detail ||
    "Error al cambiar el estado."
   );
   return false;

  } finally {
   setLoading(false);
  }
 };

 return {
  cambiarEstado,
  isLoading,
 };
};