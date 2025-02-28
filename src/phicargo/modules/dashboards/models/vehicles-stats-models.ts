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

export interface AvailableSummary {
  available: number;
  noDriver: number;
  maintenance: number;
}

export interface VehicleStats {
  revenueByVehicle: RevenueByVehicle[];
  distanceByVehicle: DistanceByVehicle[];
  availableSummary: AvailableSummary;
}

