export interface VehicleRevenueProjection {
  id: number;
  name: string;
  company: string;
  branch: string;
  driver: string;
  vehicleType: string;
  configType: string;
  status: string;
  monthlyTarget: number;
  idealDailyTarget: number;
  workingDays: number;
  operationalDays: number;
  dailyTarget: number;
  realMonthlyRevenue: number;
  availabilityStatus: string;
}

