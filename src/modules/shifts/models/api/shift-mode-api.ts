import { Dayjs } from 'dayjs';
import type { BranchSimple } from '../../../core/models';
import type { ShiftTravelInfoApi } from './travel-models-models-api';
import type { UserBasicApi } from '@/modules/auth/models';

export interface DriverInfoApi {
  id: number;
  name: string;
  tms_driver_license_id: string | null;
  tms_driver_license_type: string | null;
  tms_driver_license_expiration: Dayjs | null;
  x_modalidad: string | null;
  x_peligroso_lic: string | null;
  dias_restantes: number | null;
}

export interface VehicleInfoApi {
  id: number;
  name2: string;
  license_plate: string | null;
  fleet_type: string | null;
  x_tipo_vehiculo: string | null;
  x_modalidad: string | null;
  x_tipo_carga: string | null;
}

export interface ShiftBaseApi {
  shift: number;
  arrival_at: string;
  locked: boolean;
  maneuver1: string | null;
  maneuver2: string | null;
  archived_user_id: number | null;
  archived_date: string | null;
  archived_reason: string | null;
  comments: string | null;
  register_date: string;
  queue: boolean;
  has_recent_incident: boolean;
}

export interface ShiftApi extends ShiftBaseApi {
  id: number;
  phone: string | null;
  res_store: BranchSimple;
  driver: DriverInfoApi;
  vehicle: VehicleInfoApi;
  register_user: UserBasicApi;
  travel: ShiftTravelInfoApi | null;
}

export type ShiftSimpleApi = Pick<ShiftApi, 'id' | 'shift' | 'arrival_at' | 'driver'>;

export interface ShiftCreateApi {
  branch_id: number;
  vehicle_id: number;
  driver_id: number;
  arrival_at: string;
  comments: string;
  maneuver1: string | null;
  maneuver2: string | null;
}

export interface ShiftEditApi {
  vehicle_id?: number | null;
  arrival_at?: string | null;
  driver_id?: number | null;
  comments?: string | null;
  queue?: boolean | null;
  maneuver1?: string | null;
  maneuver2?: string | null;
  locked?: boolean | null;
}


export interface ShiftReorderApi {
  shift_id: number;
  shift: number;
}
