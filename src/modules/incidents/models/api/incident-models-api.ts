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
}

export interface IncidentApi extends IncidentBaseApi {
  id: number;
  created_at: string;
  user: UserBasicApi;
  driver: DriverInfoApi;
  vehicle: VehicleInfoApi | null;
  evidences: OneDriveFileApi[];
}

export interface IncidentCreateApi extends IncidentBaseApi {
  start_date: string | null;
  end_date: string | null;
  vehicle_id?: number | null;
  new_vehicle_state_id?: number | null;
}

export type IncidentUpdateApi = Partial<IncidentBaseApi> & {
  vehicle_id?: number | null;
  driver_id?: number | null;
};
