export interface DistanceAndRevenueByDriverApi {
  driver: string;
  travels: number;
  services: number;
  distance: number;
  amount: number;
  travel_names: string;
  waybill_names: string;
}

export interface ModalitySummaryApi {
  modality: string;
  driver_count: number;
}

export interface JobSummaryApi {
  job: number;
  driver_count: number;
}

export interface DangerousLicenseSummaryApi {
  dangerous_license: string;
  driver_count: number;
}

export interface DriverVehicleDistributionSummaryApi {
  job: string;
  with_vehicle: number;
  without_vehicle: number;
  total: number;
}

export interface DriverStatsApi {
  distance_and_revenue_by_driver: DistanceAndRevenueByDriverApi[];
  modality_summary: ModalitySummaryApi[];
  job_summary: JobSummaryApi[];
  dangerous_license_summary: DangerousLicenseSummaryApi[];
  driver_vehicle_distribution_summary: DriverVehicleDistributionSummaryApi[];
}

