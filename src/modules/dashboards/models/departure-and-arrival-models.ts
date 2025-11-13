export interface Arrival {
  arrivalStatus: string;
  travels: number;
}

export interface Departure {
  departureStatus: string;
  travels: number;
}

export interface ArrivalStatusDriver {
  driver: string;
  arrivalEarly: number;
  arrivalLate: number;
  arrivalLateJustified: number;
  noArrivalRecorded: number;
}

export interface DepartureAndArrivalStats {
  arrivals: Arrival[];
  departures: Departure[];
  arrivalStatusDrivers: ArrivalStatusDriver[];
}

