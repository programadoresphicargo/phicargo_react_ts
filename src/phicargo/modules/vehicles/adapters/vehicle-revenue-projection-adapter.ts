import type { VehicleRevenueProjection } from '../models';
import type { VehicleRevenueProjectionApi } from '../models/api';

export class VehicleRevenueProjectionAdapter {
  static toVehicleRevenueProjection(
    data: VehicleRevenueProjectionApi,
  ): VehicleRevenueProjection {
    return {
      id: data.id,
      name: data.name,
      company: data.company,
      branch: data.branch,
      driver: data.driver,
      vehicleType: data.vehicle_type,
      configType: data.config_type,
      status: data.status,
      monthlyTarget: data.monthly_target,
      idealDailyTarget: data.ideal_daily_target,
      workingDays: data.working_days,
      operationalDays: data.operational_days,
      dailyTarget: data.daily_target,
      realMonthlyRevenue: data.real_monthly_revenue,
      availabilityStatus: data.availability_status,
    };
  }
}

