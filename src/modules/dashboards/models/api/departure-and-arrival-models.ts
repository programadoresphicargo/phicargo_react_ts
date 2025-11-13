export type ArrivalStatus =
  | 'arrived_late'
  | 'arrived_late_justified'
  | 'no_arrival_recorded'
  | 'arrived_early'
  | 'no_info';
export type DepartureStatus = 'start_late' | 'late' | 'start_early' | 'no_info' | 'start_late_justified';

export interface ArrivalApi {
  arrival_status: ArrivalStatus;
  travels: number;
}

export interface DepartureApi {
  departure_status: DepartureStatus;
  travels: number;
}

export interface ArrivalStatusDriverApi {
  driver: string;
  arrived_early: number;
  arrived_late: number;
  arrived_late_justified: number;
  no_arrival_recorded: number;
}

export interface DepartureAndArrivalStatsApi {
  arrivals_stats: ArrivalApi[];
  departures_stats: DepartureApi[];
  driver_arrival_stats: ArrivalStatusDriverApi[];
}

