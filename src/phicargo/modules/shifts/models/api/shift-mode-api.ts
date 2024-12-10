import type { BranchSimple } from '../../../core/models';

export interface DriverInfoApi {
  id: number;
  name: string;
  tms_driver_license_id: string | null;
  x_peligroso_lic: string | null;
}

export interface ShiftBaseApi {
  shift: number;
  arrival_at: string;
  register_user_id: number;
  locked: boolean;
  maneuver1: string | null;
  maneuver2: string | null;
  archived_user_id: number | null;
  archived_date: string | null;
  archived_reason: string | null;
  plates: string | null;
  comments: string | null;
  register_date: string;
  queue: boolean;
}

export interface ShiftApi extends ShiftBaseApi {
  id: number;
  res_store: BranchSimple;
  driver: DriverInfoApi;
}

