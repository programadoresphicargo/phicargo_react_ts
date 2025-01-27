import type {
  DistanceByVehicle,
  RevenueByVehicle,
  VehicleStats,
} from '../models/vehicles-stats-models';
import type {
  DistanceByVehicleApi,
  RevenueByVehicleApi,
  VehicleStatsApi,
} from '../models/api/vehicles-stats-models-api';

const revenueByVehicle = (data: RevenueByVehicleApi): RevenueByVehicle => ({
  vehicle: data.vehicle,
  travels: data.travels,
  amount: data.amount,
});

const distanceByVehicle = (data: DistanceByVehicleApi): DistanceByVehicle => ({
  vehicle: data.vehicle,
  travels: data.travels,
  distance: data.distance,
});

export const vehicleStatsToLocal = (stats: VehicleStatsApi): VehicleStats => ({
  distanceByVehicle: stats.distance_by_vehicle.map(distanceByVehicle),
  revenueByVehicle: stats.revenue_by_vehicle.map(revenueByVehicle),
});

