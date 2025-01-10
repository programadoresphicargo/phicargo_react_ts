
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
  travels: number;
}

export interface ByConstructionType {
  constructionType: string;
  travels: number;
}

export interface ByCargoType {
  cargoType: string;
  travels: number;
}

export type MonthType = 'ENE' | 'FEB' | 'MAR' | 'ABR' | 'MAY' | 'JUN' | 'JUL' | 'AGO' | 'SEP' | 'OCT' | 'NOV' | 'DIC';
export interface OfYear {
  month: MonthType;
  podsSent: number;
}

export interface TravelStats {
  byBranch: ByBranch[];
  byClient: ByClient[];
  byTrafficExecutive: ByTrafficExecutive[];
  byConstructionType: ByConstructionType[];
  byCargoType: ByCargoType[];
  ofYear: OfYear[];
  monthMeta: number;
}
