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
  travel_names: string;
  waybill_names: string;
}

export interface VehicleMaintenances {
  name: string;
  dias_indisponibles: number;
  orders_service: string;
  reportes_ids: string;
  periodos_con_orden: string;
  fail_type: string;
}

export interface VehicleStats {
  distanceAndRevenueByVehicle: DistanceAndRevenueByVehicle[];
  availableSummary: AvailableSummary[];
  vehicleMaintenence: VehicleMaintenances[];
}

