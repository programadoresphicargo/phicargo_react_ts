import type {
  Arrival,
  ArrivalStatusDriver,
  Departure,
  DepartureAndArrivalStats,
} from '../models/departure-and-arrival-models';
import type {
  ArrivalApi,
  ArrivalStatusDriverApi,
  DepartureAndArrivalStatsApi,
  DepartureApi,
} from '../models/api/departure-and-arrival-models';

const arrivalToLocal = (data: ArrivalApi): Arrival => ({
  arrivalStatus: data.arrival_status,
  travels: data.travels,
});

const departureToLocal = (data: DepartureApi): Departure => ({
  departureStatus: data.departure_status,
  travels: data.travels,
});

const arrivalStatusDriverToLocal = (
  data: ArrivalStatusDriverApi,
): ArrivalStatusDriver => ({
  driver: data.driver,
  arrivalEarly: data.arrived_early,
  arrivalLate: data.arrived_late,
  noArrivalRecorded: data.no_arrival_recorded,
});

export const departureAndArrivalStatsToLocal = (
  stats: DepartureAndArrivalStatsApi,
): DepartureAndArrivalStats => ({
  arrivals: stats.arrivals_stats.map(arrivalToLocal),
  departures: stats.departures_stats.map(departureToLocal),
  arrivalStatusDrivers: stats.driver_arrival_stats.map(
    arrivalStatusDriverToLocal,
  ),
});

