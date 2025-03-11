export interface DistanceAndRevenueByVehicleApi {
  vehicle: string;
  distance: number;
  amount: number;
  travels: number;
}

export interface AvailableSummaryApi {
  available: number;
  no_driver_road: number;
  no_driver_local: number;
  maintenance_road: number;
  maintenance_local: number;
}

export interface VehicleStatsApi {
  distance_and_revenue_by_vehicle: DistanceAndRevenueByVehicleApi[];
  available_summary: AvailableSummaryApi;
}

