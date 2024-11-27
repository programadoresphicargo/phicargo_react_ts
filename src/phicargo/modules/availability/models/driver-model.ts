import { CompanySimple } from '../../core/models';
import { VehicleSimple } from './vehicle-model';

export type Modality = 'full' | 'single' | 'SIN ASIGNAR';
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
}

export type DriverSimple = Pick<
  DriverBase,
  'id' | 'name' | 'licenseType' | 'licenseId' | 'modality' | 'status' | 'job'
>;

export interface DriverEdit {
  jobId?: number;
  driverLicenseId?: string;
  driverLicenseType?: string;
  modality?: Modality;
  isDangerous?: IsDangerous;
}
