import type {
  Arrival,
  ArrivalStatusDriver,
  Departure,
  DepartureAndArrivalStats,
} from '../models/departure-and-arrival-models';
import type {
  ArrivalApi,
  ArrivalStatus,
  ArrivalStatusDriverApi,
  DepartureAndArrivalStatsApi,
  DepartureApi,
  DepartureStatus,
} from '../models/api/departure-and-arrival-models';

const statusArrivalConf: {key: ArrivalStatus, label: string}[] = [
  { key: 'arrived_early', label: 'Temprano' },
  { key: 'arrived_late', label: 'Tarde' },
  { key: 'no_arrival_recorded', label: 'Sin Llegada Registrada' },
  { key: 'no_info', label: 'Sin Información' },
];

const statusDepartureConf: {key: DepartureStatus, label: string}[] = [
  { key: 'start_early', label: 'Temprano' },
  { key: 'start_late', label: 'Tarde' },
  { key: 'late', label: 'Va tarde' },
  { key: 'no_info', label: 'Sin Información' },
];

const arrivalToLocal = (data: ArrivalApi): Arrival => ({
  arrivalStatus: statusArrivalConf.find((status) => status.key === data.arrival_status)?.label || 'Sin Información',
  travels: data.travels,
});

const departureToLocal = (data: DepartureApi): Departure => ({
  departureStatus: statusDepartureConf.find((status) => status.key === data.departure_status)?.label || 'Sin Información',
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

