export interface DistanceAndRevenueByDriverApi {
  driver: string;
  distance: number;
  amount: number;
  travels: number;
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

export interface DriverStatsApi {
  distance_and_revenue_by_driver: DistanceAndRevenueByDriverApi[];
  modality_summary: ModalitySummaryApi[];
  job_summary: JobSummaryApi[];
  dangerous_license_summary: DangerousLicenseSummaryApi[];
}

