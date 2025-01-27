export interface RevenueByDriver {
  driver: string;
  travels: number;
  amount: number;
}

export interface DistanceByDriver {
  driver: string;
  travels: number;
  distance: number;
}

export interface DriverStats {
  revenueByDriver: RevenueByDriver[];
  distanceByDriver: DistanceByDriver[];
}

