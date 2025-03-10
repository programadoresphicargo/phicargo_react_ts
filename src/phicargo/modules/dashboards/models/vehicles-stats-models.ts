
export interface AvailableSummary {
  available: number;
  noDriver: number;
  maintenance: number;
}

export interface DistanceAndRevenueByVehicle {
  vehicle: string;
  distance: number;
  amount: number;
  travels: number;
}

export interface VehicleStats {
  distanceAndRevenueByVehicle: DistanceAndRevenueByVehicle[];
  availableSummary: AvailableSummary;
}

