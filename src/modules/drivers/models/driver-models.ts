import type {
  CompanySimple,
  ManeuverSimple,
  TravelSimple,
} from '../../core/models';

import { Dayjs } from 'dayjs';
import { DriverPermissionSimple } from './unavailability-models';
import { VehicleSimple } from '../../vehicles/models';

export type Modality = 'full' | 'sencillo' | 'single';
export type IsDangerous = 'SI' | 'NO';
export type Job = 'OPERADOR' | 'MOVEDOR' | 'OPERADOR POSTURERO';
export type DriverStatus = 'viaje' | 'disponible' | 'maniobra';

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
  readonly status: DriverStatus | null;
  readonly travelId: number | null;
  readonly maneuverId: number | null;
  hireDate: Dayjs | null;

  job: JobSimple;
  company: CompanySimple | null;
}

export interface Driver extends DriverBase {
  readonly vehicle: VehicleSimple | null;
  readonly permission: DriverPermissionSimple | null;
  password: string | null;

  travel: TravelSimple | null;
  maneuver: ManeuverSimple | null;
  lastManeuver: ManeuverSimple | null;
}

export type DriverSimple = Pick<
  DriverBase,
  'id' | 'name' | 'licenseType' | 'licenseId' | 'modality' | 'status' | 'job'
>;

export type DriverPosturaSimple = Pick<DriverBase, 'id' | 'name' | 'job'> & {
  startDate: Dayjs;
  endDate: Dayjs;
};

export interface DriverEdit {
  jobId?: number | null;
  licenseId?: string | null;
  licenseType?: string | null;
  modality?: Modality | null;
  isDangerous?: IsDangerous | null;
  isActive?: boolean | null;
  hireDate?: Dayjs | null;
}

export interface DriverWithRealStatus extends Driver {
  readonly realStatus: string;
}

