import type { UserBasicApi } from '@/modules/auth/models';
import { IncidentType } from '../incident-models';
import { OneDriveFileApi } from '@/modules/core/models/api';
import { Mail } from '@/phicargo/almacen/solicitud/cambios/epps';

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
  comentarios_cancelacion: string | null;
}

export interface DescuentoApi {
  id_descuento: number | null;
  id_solicitante: number | null;
  id_empleado: number | null;
  importe: number;
  monto: number;
  comentarios: string;
  motivo: string;
  periodicidad: string;
  type: string;
  fecha: string | null;
  estado: string;
  comentarios_cancelacion: string | null;
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
  mails: Mail[]
}

export interface IncidentCreateApi extends IncidentBaseApi {
  start_date: string | null;
  end_date: string | null;
  vehicle_id?: number | null;
  new_vehicle_state_id?: number | null;
  descuento?: DescuentoApi | null;
}

export type IncidentUpdateApi = Partial<IncidentBaseApi> & {
  vehicle_id?: number | null;
  driver_id?: number | null;
  attended_at?: string | null;
  descuento?: DescuentoApi | null;
};
