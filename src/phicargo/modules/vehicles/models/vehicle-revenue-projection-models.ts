import type { Modality } from '../../drivers/models';

export interface VehicleRevenueProjection {
  id: number;
  name: string;
  company: string;
  branch: string;
  driver: string;
  vehicleType: string;
  configType: Modality;
  status: string;
  monthlyTarget: number;
  idealDailyTarget: number;
  workingDays: number;
  operationalDays: number;
  dailyTarget: number;
  realMonthlyRevenue: number;
  availabilityStatus: string;
}

