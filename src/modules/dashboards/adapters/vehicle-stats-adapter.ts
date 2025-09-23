import type {
  AvailableSummary,
  DistanceAndRevenueByVehicle,
  VehicleStats,
} from '../models/vehicles-stats-models';
import type {
  AvailableSummaryApi,
  DistanceAndRevenueByVehicleApi,
  VehicleStatsApi,
  VehiclesMaintenanceApi,
} from '../models/api/vehicles-stats-models-api';

export class VehicleStatsAdapter {
  static availableSummary(data: AvailableSummaryApi): AvailableSummary {
    return {
      vehicleType: data.vehicle_type,
      total: data.total,
      available: data.available,
      noDriverNoPostura: data.no_driver_no_postura,
      noDriverPostura: data.no_driver_postura,
      maintenanceNoDriver: data.maintenance_no_driver,
      maintenanceDriver: data.maintenance_driver,
    };
  }

  static distanceAndRevenueByVehicle(
    data: DistanceAndRevenueByVehicleApi,
  ): DistanceAndRevenueByVehicle {
    return {
      vehicle: data.vehicle,
      travels: data.travels,
      services: data.services,
      distance: data.distance,
      amount: data.amount,
    };
  }

  static vehiclesMaintenance(
    data: VehiclesMaintenanceApi,
  ): VehiclesMaintenanceApi {
    return {
      name: data.name,
      dias_indisponibles: data.dias_indisponibles,
      reportes_ids: data.reportes_ids,
      orders_service: data.orders_service,
      periodos_con_orden: data.periodos_con_orden,
      fail_type: data.fail_type
    };
  }

  static vehicleStatsToLocal(stats: VehicleStatsApi): VehicleStats {
    return {
      distanceAndRevenueByVehicle: stats.distance_and_revenue_by_vehicle.map(
        VehicleStatsAdapter.distanceAndRevenueByVehicle,
      ),
      availableSummary: stats.available_summary.map(
        VehicleStatsAdapter.availableSummary,
      ),
      vehicleMaintenence: stats.vehicles_maintenance.map(VehicleStatsAdapter.vehiclesMaintenance)
    };
  }
}

