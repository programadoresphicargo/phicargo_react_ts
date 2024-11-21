
export type Job = 'OPERADOR' | 'MOVEDOR' | 'OPERADOR POSTURERO';
export type Modality = 'full' | 'single' | 'SIN ASIGNAR';
export type Status = 'viaje' | 'disponible' | 'maniobra' | 'SIN ASIGNAR';

export interface Driver {
  readonly id: number,
  readonly name: string,
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
  available: boolean,
  reason: string,
  vehicleId: number,
  modality?: Modality
}
