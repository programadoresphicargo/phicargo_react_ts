import type {
  VehicleRevenueProjection,
  VehicleRevenueProjectionByBranch,
} from '../models';
import type {
  VehicleRevenueProjectionApi,
  VehicleRevenueProjectionByBranchApi,
} from '../models/api';

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
  static toVehicleRevenueProjectionByBranch(
    data: VehicleRevenueProjectionByBranchApi,
  ): VehicleRevenueProjectionByBranch {
    return {
      branch: data.branch,
      monthlyTarget: data.monthly_target,
      dailyTarget: data.daily_target,
      totalWorkingDays: data.total_working_days,
      idealMonthlyRevenue: data.ideal_monthly_revenue,
      realMonthlyRevenue: data.real_monthly_revenue,
    };
  }
}

