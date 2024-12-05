import type { CompanySimple, ManeuverSimple, TravelSimple } from '../../core/models';

import type { DriverPermissionSimple } from './driver-unavailability';
import type { VehicleSimple } from './vehicle-model';

export type Modality = 'full' | 'sencillo' | 'SIN ASIGNAR';
export type IsDangerous = 'SI' | 'NO' | 'SIN ASIGNAR';
export type Job = 'OPERADOR' | 'MOVEDOR' | 'OPERADOR POSTURERO';
export type Status = 'viaje' | 'disponible' | 'maniobra' | 'SIN ASIGNAR';

type JobSimple = {
  id: number;
  name: Job;
};

export interface DriverBase {
  readonly id: number;
  readonly name: string;
  readonly isActive: boolean;
  licenseType: string;
  licenseId: string;
  noLicense: string;
  modality: Modality;
  isDangerous: IsDangerous;
  readonly status: Status;
  readonly travelId: number | null;
  readonly maneuverId: number | null;

  job: JobSimple;
  company: CompanySimple | null;
}

export interface Driver extends DriverBase {
  readonly vehicle: VehicleSimple | null;
  readonly permissions: DriverPermissionSimple[];

  travel: TravelSimple | null;
  maneuver: ManeuverSimple | null;
}

export type DriverSimple = Pick<
  DriverBase,
  'id' | 'name' | 'licenseType' | 'licenseId' | 'modality' | 'status' | 'job'
>;

export interface DriverEdit {
  jobId?: number;
  licenseId?: string;
  licenseType?: string;
  modality?: Modality;
  isDangerous?: IsDangerous;
}

export interface DriverWithRealStatus extends Driver {
  readonly realStatus: string;
}
