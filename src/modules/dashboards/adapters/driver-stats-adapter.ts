import type {
  DangerousLicenseSummary,
  DistanceAndRevenueByDriver,
  DriverStats,
  DriverVehicleDistributionSummary,
  JobSummary,
  ModalitySummary,
} from '../models/driver-stats-models';
import type {
  DangerousLicenseSummaryApi,
  DriverStatsApi,
  JobSummaryApi,
  ModalitySummaryApi,
} from '../models/api/driver-stats-models-api';

import {
  DistanceAndRevenueByDriverApi,
  DriverVehicleDistributionSummaryApi,
} from '../models/api/driver-stats-models-api';

export class DriverStatsAdapter {
  static toDistanceAndRevenueByDriver(
    data: DistanceAndRevenueByDriverApi,
  ): DistanceAndRevenueByDriver {
    return {
      driver: data.driver,
      services: data.services,
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

  static toDriverVehicleDistributionSummary(
    data: DriverVehicleDistributionSummaryApi,
  ): DriverVehicleDistributionSummary {
    return {
      job: data.job,
      withVehicle: data.with_vehicle,
      withoutVehicle: data.without_vehicle,
      total: data.total,
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
      driverVehicleDistributionSummary:
        data.driver_vehicle_distribution_summary.map(
          DriverStatsAdapter.toDriverVehicleDistributionSummary,
        ),
    };
  }
}

