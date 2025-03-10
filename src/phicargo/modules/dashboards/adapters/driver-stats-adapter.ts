import type {
  DangerousLicenseSummary,
  DistanceAndRevenueByDriver,
  DriverStats,
  JobSummary,
  ModalitySummary,
} from '../models/driver-stats-models';
import type {
  DangerousLicenseSummaryApi,
  DriverStatsApi,
  JobSummaryApi,
  ModalitySummaryApi,
} from '../models/api/driver-stats-models-api';

import { DistanceAndRevenueByDriverApi } from '../models/api/driver-stats-models-api';

export class DriverStatsAdapter {
  static toDistanceAndRevenueByDriver(
    data: DistanceAndRevenueByDriverApi,
  ): DistanceAndRevenueByDriver {
    return {
      driver: data.driver,
      distance: data.distance,
      amount: data.amount,
      travels: data.travels,
    };
  }

  static toModalitySummary(data: ModalitySummaryApi): ModalitySummary {
    return {
      modality: data.modality,
      driverCount: data.driver_count,
    };
  }

  static toJobSummary(data: JobSummaryApi): JobSummary {
    return {
      job: data.job,
      driverCount: data.driver_count,
    };
  }

  static toDangerousLicenseSummary(
    data: DangerousLicenseSummaryApi,
  ): DangerousLicenseSummary {
    return {
      dangerousLicense: data.dangerous_license,
      driverCount: data.driver_count,
    };
  }

  static toDriverStats(data: DriverStatsApi): DriverStats {
    return {
      distanceAndRevenueByDriver: data.distance_and_revenue_by_driver.map(
        DriverStatsAdapter.toDistanceAndRevenueByDriver,
      ),
      modalitySummary: data.modality_summary.map(
        DriverStatsAdapter.toModalitySummary,
      ),
      jobSummary: data.job_summary.map(DriverStatsAdapter.toJobSummary),
      dangerousLicenseSummary: data.dangerous_license_summary.map(
        DriverStatsAdapter.toDangerousLicenseSummary,
      ),
    };
  }
}

