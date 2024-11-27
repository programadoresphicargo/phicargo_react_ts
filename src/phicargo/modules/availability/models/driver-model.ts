import { CompanySimple } from "../../core/models";
import { VehicleSimple } from "./vehicle-model";

export type Job = 'OPERADOR' | 'MOVEDOR' | 'OPERADOR POSTURERO';
export type Modality = 'full' | 'single' | 'SIN ASIGNAR';
export type Status = 'viaje' | 'disponible' | 'maniobra' | 'SIN ASIGNAR';

type JobSimple = {
  id: number;
  name: Job;
}


interface DriverBase {
  readonly id: number;
  readonly name: string;
  licenseType: string;
  licenseId: string;
  modality: Modality;
  job: JobSimple | null;  
}

export type DriverSimple = DriverBase;

export interface Driver {
  readonly id: number,
  readonly name: string,
  readonly jobId: number,
  readonly job: Job,
  isActive: boolean,
  readonly company: string,
  driverLicenseId: string,
  driverLicenseType: string,
  driverLicenseExpiration: Date | null,
  isDriver: boolean,
  noLicense: string,
  modality: Modality,
  isDangerous: string,
  readonly status: Status,
  viaje: number,
  maniobra: number,
  vehicleId: number,
  vehicleName: string,
  vehicleActive: boolean
}


export interface DriverEdit {
  jobId?: number;
  driverLicenseId?: string;
  driverLicenseType?: string;
  modality?: Modality;
  isDangerous?: 'SI' | 'NO';
}

export interface DriverSimple2 {
  readonly id: number;
  readonly name: string;
  liceseType: string;
  licenseId: string;
  modality: Modality;

  job: JobSimple | null;
  company: CompanySimple | null;
  vehicle: VehicleSimple | null;
}
