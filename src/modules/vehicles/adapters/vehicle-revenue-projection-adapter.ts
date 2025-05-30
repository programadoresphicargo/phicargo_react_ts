import type {
  VehicleRevenueProjection,
  VehicleRevenueProjectionByBranch,
} from '../models';
import type {
  VehicleRevenueProjectionApi,
  VehicleRevenueProjectionByBranchApi,
  VehicleRevenueProjectionByBranchHistoryApi,
} from '../models/api';

import { VehicleRevenueProjectionByBranchHistory } from '../models/vehicle-revenue-projection-models';
import dayjs from 'dayjs';
import { getMonthName } from '@/utilities';

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
      monthDays: data.month_days,
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
      id: data.real_monthly_revenue, // TODO: Fix this
      branch: data.branch,
      monthlyTarget: data.monthly_target,
      dailyTarget: data.daily_target,
      totalWorkingDays: data.total_working_days,
      idealMonthlyRevenue: data.ideal_monthly_revenue,
      realMonthlyRevenue: data.real_monthly_revenue,
      realMonthlyRevenueLocal: data.real_monthly_revenue_local,
      extraCosts: data.extra_costs,
    };
  }
  static toVehicleRevenueProjectionByBranchHistory(
    data: VehicleRevenueProjectionByBranchHistoryApi,
  ): VehicleRevenueProjectionByBranchHistory {
    return {
      id: data.real_monthly_revenue, // TODO: Fix this
      branch: data.branch,
      monthStart: dayjs(data.month_start),
      monthEnd: dayjs(data.month_end),
      month: getMonthName(data.month, true),
      monthlyTarget: data.monthly_target,
      dailyTarget: data.daily_target,
      totalWorkingDays: data.total_working_days,
      idealMonthlyRevenue: data.ideal_monthly_revenue,
      realMonthlyRevenue: data.real_monthly_revenue,
      extraCosts: data.extra_costs,
      total: data.total,
    };
  }
}

