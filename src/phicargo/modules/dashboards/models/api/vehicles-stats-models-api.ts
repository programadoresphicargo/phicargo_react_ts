export interface DistanceAndRevenueByVehicleApi {
  vehicle: string;
  distance: number;
  amount: number;
}

export interface AvailableSummaryApi {
  available: number;
  no_driver: number;
  maintenance: number;
}

export interface VehicleStatsApi {
  distance_and_revenue_by_vehicle: DistanceAndRevenueByVehicleApi[];
  available_summary: AvailableSummaryApi;
}

