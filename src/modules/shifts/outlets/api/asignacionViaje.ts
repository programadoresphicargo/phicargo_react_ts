// api/asignacionViaje.ts
import odooApi from "@/api/odoo-api";

interface ApiSuccessResponse {
 status: string;
 message: string;
}

export interface AsignacionViajePayload {
 id_cp: number
 date_start: string | null;
 x_date_arrival_shed: string | null;
 x_eco_bel_id: number | null;
}

export const postAsignacionViaje = async (
 shiftId: number,
 payload: AsignacionViajePayload
): Promise<ApiSuccessResponse> => {
 const { data } = await odooApi.put(
  `/shifts/${shiftId}/assign-travel`,
  payload
 );

 return data;
};
