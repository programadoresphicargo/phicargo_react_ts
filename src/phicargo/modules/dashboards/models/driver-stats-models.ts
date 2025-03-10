export interface DistanceAndRevenueByDriver {
  driver: string;
  distance: number;
  amount: number;
  travels: number;
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

export interface DriverStats {
  distanceAndRevenueByDriver: DistanceAndRevenueByDriver[];
  modalitySummary: ModalitySummary[];
  jobSummary: JobSummary[];
  dangerousLicenseSummary: DangerousLicenseSummary[];
}

