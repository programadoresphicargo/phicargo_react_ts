import type {
  CompanySimple,
  ManeuverSimpleApi,
  TravelSimpleApi,
} from '../../../core/models';
import type { DriverStatus, IsDangerous, Job, Modality } from '../driver-models';

import type { DriverPermissionSimpleApi } from './unavailability-models-api';
import type { VehicleSimpleApi } from '@/modules/vehicles/models/api';

type JobSimple = {
  id: number;
  name: Job;
};

export interface DriverBaseApi {
  id: number;
  name: string;
  active: boolean;
  tms_driver_license_id: string | null;
  tms_driver_license_type: string | null;
  no_licencia: string | null;
  x_modalidad: Modality | null;
  x_peligroso_lic: IsDangerous | null;
  x_status: DriverStatus | null;
  x_viaje: number | null;
  x_maniobra: number | null;
  x_hire_date: string | null;

  job: JobSimple;
  res_company: CompanySimple | null;
}

export type DriverSimpleApi = Pick<
  DriverBaseApi,
  | 'id'
  | 'name'
  | 'tms_driver_license_type'
  | 'tms_driver_license_id'
  | 'x_modalidad'
  | 'x_status'
  | 'job'
>;

export interface DriverApi extends DriverBaseApi {
  vehicle: VehicleSimpleApi | null;
  permission: DriverPermissionSimpleApi | null;

  password: string | null;

  tms_travel: TravelSimpleApi | null;
  maniobra: ManeuverSimpleApi | null;
  last_maneuver: ManeuverSimpleApi | null;
}

export interface DriverEditApi {
  job_id?: number | null;
  tms_driver_license_id?: string | null;
  tms_driver_license_type?: string | null;
  x_modalidad?: Modality | null;
  x_peligroso_lic?: 'SI' | 'NO' | null;
  active?: boolean | null;
  x_hire_date?: string | null;
}
