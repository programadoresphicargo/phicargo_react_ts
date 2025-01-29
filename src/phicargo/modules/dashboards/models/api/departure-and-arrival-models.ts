export interface ArrivalApi {
  arrival_status: string;
  travels: number;
}

export interface DepartureApi {
  departure_status: string;
  travels: number;
}

export interface ArrivalStatusDriverApi {
  driver: string;
  arrived_early: number;
  arrived_late: number;
  no_arrival_recorded: number;
}

export interface DepartureAndArrivalStatsApi {
  arrivals_stats: ArrivalApi[];
  departures_stats: DepartureApi[];
  driver_arrival_stats: ArrivalStatusDriverApi[];
}

