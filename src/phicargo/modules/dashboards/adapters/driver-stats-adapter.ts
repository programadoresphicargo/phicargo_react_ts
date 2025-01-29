import type {
  DistanceByDriver,
  DriverStats,
  RevenueByDriver,
} from '../models/driver-stats-models';
import type {
  DistanceByDriverApi,
  DriverStatsApi,
  RevenueByDriverApi,
} from '../models/api/driver-stats-models-api';

const revenueByDriver = (data: RevenueByDriverApi): RevenueByDriver => ({
  driver: data.driver,
  travels: data.travels,
  amount: data.amount,
});

const distanceByDriver = (data: DistanceByDriverApi): DistanceByDriver => ({
  driver: data.driver,
  travels: data.travels,
  distance: data.distance,
});

export const driverStatsToLocal = (stats: DriverStatsApi): DriverStats => ({
  distanceByDriver: stats.distance_by_driver.map(distanceByDriver),
  revenueByDriver: stats.revenue_by_driver.map(revenueByDriver),
});

