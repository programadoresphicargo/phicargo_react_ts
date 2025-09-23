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
  no_driver_no_postura: number;
  no_driver_postura: number;
  maintenance_no_driver: number;
  maintenance_driver: number;
}

export interface VehiclesMaintenanceApi {
  name: string;
  dias_indisponibles: number;
  orders_service: string;
  reportes_ids: string;
  periodos_con_orden: string;
}

export interface VehicleStatsApi {
  distance_and_revenue_by_vehicle: DistanceAndRevenueByVehicleApi[];
  available_summary: AvailableSummaryApi[];
  vehicles_maintenance: VehiclesMaintenanceApi[];
}

