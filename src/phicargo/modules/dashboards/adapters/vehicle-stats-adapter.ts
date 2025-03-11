import type {
  AvailableSummary,
  DistanceAndRevenueByVehicle,
  VehicleStats,
} from '../models/vehicles-stats-models';
import type {
  AvailableSummaryApi,
  DistanceAndRevenueByVehicleApi,
  VehicleStatsApi,
} from '../models/api/vehicles-stats-models-api';

const availableSummary = (data: AvailableSummaryApi): AvailableSummary => ({
  available: data.available,
  noDriverRoad: data.no_driver_road,
  noDriverLocal: data.no_driver_local,
  maintenanceRoad: data.maintenance_road,
  maintenanceLocal: data.maintenance_local,
});

const distanceAndRevenueByVehicle = (
  data: DistanceAndRevenueByVehicleApi,
): DistanceAndRevenueByVehicle => ({
  vehicle: data.vehicle,
  distance: data.distance,
  amount: data.amount,
  travels: data.travels,
});

export const vehicleStatsToLocal = (stats: VehicleStatsApi): VehicleStats => ({
  distanceAndRevenueByVehicle: stats.distance_and_revenue_by_vehicle.map(
    distanceAndRevenueByVehicle,
  ),
  availableSummary: availableSummary(stats.available_summary),
});

