export interface AvailableSummary {
  vehicleType: string;
  total: number;
  available: number;
  noDriverNoPostura: number;
  noDriverPostura: number;
  maintenanceNoDriver: number;
  maintenanceDriver: number;
}

export interface DistanceAndRevenueByVehicle {
  vehicle: string;
  travels: number;
  services: number;
  distance: number;
  amount: number;
}

export interface VehicleStats {
  distanceAndRevenueByVehicle: DistanceAndRevenueByVehicle[];
  availableSummary: AvailableSummary[];
}

