import type { Modality } from '@/modules/drivers/models';

export interface VehicleRevenueProjectionApi {
  id: number;
  name: string;
  company: string;
  branch: string;
  driver: string;
  vehicle_type: string;
  config_type: Modality;
  status: string;
  monthly_target: number;
  ideal_daily_target: number;
  month_days: number;
  working_days: number;
  operational_days: number;
  daily_target: number;
  real_monthly_revenue: number;
  availability_status: string;
}

export interface VehicleRevenueProjectionByBranchApi {
  branch: string;
  monthly_target: number;
  daily_target: number;
  total_working_days: number;
  ideal_monthly_revenue: number;
  real_monthly_revenue: number;
  extra_costs: number;
}

export interface VehicleRevenueProjectionByBranchHistoryApi {
  branch: string;
  month_start: string;
  month_end: string;
  month: number;
  monthly_target: number;
  daily_target: number;
  total_working_days: number;
  ideal_monthly_revenue: number;
  real_monthly_revenue: number;
  extra_costs: number;
  total: number;
}

