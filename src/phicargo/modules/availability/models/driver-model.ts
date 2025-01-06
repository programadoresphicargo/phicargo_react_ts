import type { CompanySimple, ManeuverSimple, TravelSimple } from '../../core/models';

import type { DriverPermissionSimple } from './driver-unavailability';
import type { VehicleSimple } from './vehicle-model';

export type Modality = 'full' | 'sencillo' | 'single';
export type IsDangerous = 'SI' | 'NO';
export type Job = 'OPERADOR' | 'MOVEDOR' | 'OPERADOR POSTURERO';
export type Status = 'viaje' | 'disponible' | 'maniobra';

type JobSimple = {
  id: number;
  name: Job;
};

export interface DriverBase {
  readonly id: number;
  readonly name: string;
  readonly isActive: boolean;
  licenseType: string | null;
  licenseId: string | null;
  noLicense: string | null;
  modality: Modality | null;
  isDangerous: IsDangerous | null;
  readonly status: Status | null;
  readonly travelId: number | null;
  readonly maneuverId: number | null;

  job: JobSimple;
  company: CompanySimple | null;
}

export interface Driver extends DriverBase {
  readonly vehicle: VehicleSimple | null;
  readonly permissions: DriverPermissionSimple | null;

  travel: TravelSimple | null;
  maneuver: ManeuverSimple | null;
}

export type DriverSimple = Pick<
  DriverBase,
  'id' | 'name' | 'licenseType' | 'licenseId' | 'modality' | 'status' | 'job'
>;

export interface DriverEdit {
  jobId?: number | null;
  licenseId?: string | null;
  licenseType?: string | null;
  modality?: Modality | null;
  isDangerous?: IsDangerous | null;
  isActive?: boolean | null;
}

export interface DriverWithRealStatus extends Driver {
  readonly realStatus: string;
}
