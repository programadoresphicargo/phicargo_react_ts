export interface RevenueByDriverApi {
  driver: string;
  travels: number;
  amount: number;
}

export interface DistanceByDriverApi {
  driver: string;
  travels: number;
  distance: number;
}

export interface DriverStatsApi {
  revenue_by_driver: RevenueByDriverApi[];
  distance_by_driver: DistanceByDriverApi[];
}

