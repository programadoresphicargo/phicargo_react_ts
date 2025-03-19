export interface DistanceAndRevenueByDriver {
  driver: string;
  travels: number;
  services: number;
  distance: number;
  amount: number;
}

export interface ModalitySummary {
  modality: string;
  driverCount: number;
}

export interface JobSummary {
  job: number;
  driverCount: number;
}

export interface DangerousLicenseSummary {
  dangerousLicense: string;
  driverCount: number;
}

export interface DriverVehicleDistributionSummary {
  job: string;
  withVehicle: number;
  withoutVehicle: number;
  total: number;
}

export interface DriverStats {
  distanceAndRevenueByDriver: DistanceAndRevenueByDriver[];
  modalitySummary: ModalitySummary[];
  jobSummary: JobSummary[];
  dangerousLicenseSummary: DangerousLicenseSummary[];
  driverVehicleDistributionSummary: DriverVehicleDistributionSummary[];
}

