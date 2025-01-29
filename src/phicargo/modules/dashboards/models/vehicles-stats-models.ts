export interface RevenueByVehicle {
  vehicle: string;
  travels: number;
  amount: number;
}

export interface DistanceByVehicle {
  vehicle: string;
  travels: number;
  distance: number;
}

export interface VehicleStats {
  revenueByVehicle: RevenueByVehicle[];
  distanceByVehicle: DistanceByVehicle[];
}

