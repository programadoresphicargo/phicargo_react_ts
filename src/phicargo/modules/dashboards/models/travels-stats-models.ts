
export interface ByBranch {
  branch: string;
  code: string;
  podsSent: number;
  podsPending: number;
  total: number;
}

export interface ByClient {
  client: string;
  travels: number;
}

export interface ByTrafficExecutive {
  trafficExecutive: string;
  totalTravels: number;
  travelsPending: number;
  travelsCompleted: number;
}

export interface ByConstructionType {
  constructionType: string;
  totalTravels: number;
  travelsPending: number;
  travelsCompleted: number;
}

export interface ByCargoType {
  cargoType: string;
  totalTravels: number;
  travelsPending: number;
  travelsCompleted: number;
}

export type MonthType = 'ENE' | 'FEB' | 'MAR' | 'ABR' | 'MAY' | 'JUN' | 'JUL' | 'AGO' | 'SEP' | 'OCT' | 'NOV' | 'DIC';
export interface OfYear {
  month: MonthType;
  podsSent: number;
}

export interface ByRoute {
  route: string;
  travels: number;
}

export interface ByCategory {
  category: string;
  travels: number;
}

export interface TravelStats {
  byBranch: ByBranch[];
  byClient: ByClient[];
  byTrafficExecutive: ByTrafficExecutive[];
  byConstructionType: ByConstructionType[];
  byCargoType: ByCargoType[];
  ofYear: OfYear[];
  monthMeta: number;

  byRoute: ByRoute[];
  byCategory: ByCategory[];
}
