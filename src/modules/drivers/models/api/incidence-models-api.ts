import { IncidenceType } from '../incidence-models';
import type { UserBasicApi } from '@/modules/auth/models';

export interface DriverInfoApi {
  id: number;
  name: string;
  tms_driver_license_id: string | null;
  x_modalidad: string | null;
  x_peligroso_lic: string | null;
}

interface IncidenceBaseApi {
  incidence: string;
  comments: string;
  type: IncidenceType;
}

export interface IncidenceApi extends IncidenceBaseApi {
  id: number;
  created_at: string;
  user: UserBasicApi;
  driver: DriverInfoApi;
}

export interface IncidenceCreateApi extends IncidenceBaseApi {
  start_date: string | null;
  end_date: string | null;
}

