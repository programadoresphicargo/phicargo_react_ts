import type { UserBasicApi } from '@/modules/auth/models';
import { IncidentType } from '../incident-models';

export interface DriverInfoApi {
  id: number;
  name: string;
  tms_driver_license_id: string | null;
  x_modalidad: string | null;
  x_peligroso_lic: string | null;
}

interface IncidentBaseApi {
  incidence: string;
  comments: string;
  type: IncidentType;
}

export interface IncidentApi extends IncidentBaseApi {
  id: number;
  created_at: string;
  user: UserBasicApi;
  driver: DriverInfoApi;
}

export interface IncidentCreateApi extends IncidentBaseApi {
  start_date: string | null;
  end_date: string | null;
}

