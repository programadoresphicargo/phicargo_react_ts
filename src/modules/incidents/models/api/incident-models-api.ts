import type { UserBasicApi } from '@/modules/auth/models';
import { IncidentType } from '../incident-models';
import { OneDriveFileApi } from '@/modules/core/models/api';

export interface DriverInfoApi {
  id: number;
  name: string;
  tms_driver_license_id: string | null;
  x_modalidad: string | null;
  x_peligroso_lic: string | null;
}

export interface VehicleInfoApi {
  id: number;
  name2: string;
  license_plate: string | null;
  fleet_type: string | null;
  x_status: string | null;
}

interface IncidentBaseApi {
  incidence: string;
  comments: string;
  type: IncidentType;
  incident_date: string | null;
  damage_cost: number | null;
  is_driver_responsible: boolean;
  state: string | null;
}

export interface DescuentoApi {
  id_descuento: number | null;
  id_solicitante: number | null;
  id_empleado: number | null;
  importe: number;
  monto: number;
  comentarios: string | null;
  motivo: string | null;
  periodicidad: string | null;
}

export interface IncidentApi extends IncidentBaseApi {
  id: number;
  created_at: string;
  user: UserBasicApi;
  driver: DriverInfoApi;
  vehicle: VehicleInfoApi | null;
  attended_at: string | null;
  evidences: OneDriveFileApi[];
  descuento: DescuentoApi | null;
}

export interface IncidentCreateApi extends IncidentBaseApi {
  start_date: string | null;
  end_date: string | null;
  vehicle_id?: number | null;
  new_vehicle_state_id?: number | null;
  id_descuento?: number | null;
  id_solicitante?: number | null;
  periodicidad?: string | null;
  discountAmount?: number | null;
  discountTotal?: number | null;
  discountReason?: string | null;
  discountComments?: string | null;
}

export type IncidentUpdateApi = Partial<IncidentBaseApi> & {
  vehicle_id?: number | null;
  driver_id?: number | null;
  attended_at?: string | null;
  id_descuento?: number | null;
  discountAmount?: number | null;
  discountTotal?: number | null;
  discountReason?: string | null;
  discountComments?: string | null;
  periodicidad?: string | null;
  id_solicitante?: number | null;
};
