import type { Modality } from '@/phicargo/modules/drivers/models';

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
  working_days: number;
  operational_days: number;
  daily_target: number;
  real_monthly_revenue: number;
  availability_status: string;
}

