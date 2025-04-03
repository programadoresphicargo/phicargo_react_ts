export interface DistanceAndRevenueByVehicleApi {
  vehicle: string;
  travels: number;
  services: number;
  distance: number;
  amount: number;
}

export interface AvailableSummaryApi {
  vehicle_type: string;
  total: number;
  available: number;
  no_driver: number;
  maintenance: number;
}

export interface VehicleStatsApi {
  distance_and_revenue_by_vehicle: DistanceAndRevenueByVehicleApi[];
  available_summary: AvailableSummaryApi[];
}

