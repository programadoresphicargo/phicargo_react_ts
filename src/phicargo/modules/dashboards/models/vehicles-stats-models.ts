
export interface AvailableSummary {
  available: number;
  noDriverRoad: number;
  noDriverLocal: number;
  maintenanceRoad: number;
  maintenanceLocal: number;
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

