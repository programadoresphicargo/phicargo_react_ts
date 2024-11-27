import type { Job, Modality, Status } from '../driver-model';

import { CompanySimple } from '../../../core/models';
import { VehicleSimpleApi } from './vehicle-model-api';

type JobSimple = {
  id: number;
  name: Job;
}

interface DriverBaseApi {
  readonly id: number;
  readonly name: string;
  tms_driver_license_type: string | null;
  tms_driver_license_id: string | null;
  x_modalidad: Modality;
  job: JobSimple | null;  
}

export type DriverSimpleApi = DriverBaseApi;

export interface DriverApi {
  id: number;
  name: string;
  job_id: number;
  job: Job;
  active: boolean;
  company: string;
  tms_driver_license_id: string | null;
  tms_driver_license_type: string | null;
  tms_driver_license_expiration: string | null;
  is_driver: boolean | null;
  no_license: string | null;
  x_modalidad: Modality | null;
  x_peligroso_lic: string | null;
  x_status: Status | null;
  x_viaje: number | null;
  x_maniobra: number | null;
  vehicle_id: number | null;
  vehicle_name: string | null;
  vehicle_active: boolean | null;
}

export interface DriverEditApi {
  job_id?: number; 
  tms_driver_license_id?: string | null;
  tms_driver_license_type?: string | null;
  x_modalidad?: Modality | null;
  x_peligroso_lic?: 'SI' | 'NO' | null;
}

export interface DriverSimple2Api {
  readonly id: number;
  readonly name: string;
  tms_driver_license_type: string | null;
  tms_driver_license_id: string | null;
  x_modalidad: Modality | null;

  job: JobSimple | null;
  res_company: CompanySimple | null;
  vehicle: VehicleSimpleApi[];
}
