export interface RevenueByVehicleApi {
  vehicle: string;
  travels: number;
  amount: number;
}

export interface DistanceByVehicleApi {
  vehicle: string;
  travels: number;
  distance: number;
}

export interface VehicleStatsApi {
  revenue_by_vehicle: RevenueByVehicleApi[];
  distance_by_vehicle: DistanceByVehicleApi[];
}

