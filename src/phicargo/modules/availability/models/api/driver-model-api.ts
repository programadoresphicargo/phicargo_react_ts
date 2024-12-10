import type { CompanySimple, ManeuverSimpleApi, TravelSimpleApi } from '../../../core/models';
import type { IsDangerous, Job, Modality, Status } from '../driver-model';

import type { DriverPermissionSimpleApi } from './driver-unavailability-api';
import type { VehicleSimpleApi } from './vehicle-model-api';

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
  x_status: Status | null;
  x_viaje: number | null;
  x_maniobra: number | null;

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
  vehicle: VehicleSimpleApi[];
  permissions: DriverPermissionSimpleApi[];

  tms_travel: TravelSimpleApi | null;
  maniobra: ManeuverSimpleApi | null;
}

export interface DriverEditApi {
  job_id?: number | null;
  tms_driver_license_id?: string | null;
  tms_driver_license_type?: string | null;
  x_modalidad?: Modality | null;
  x_peligroso_lic?: 'SI' | 'NO' | null;
}
