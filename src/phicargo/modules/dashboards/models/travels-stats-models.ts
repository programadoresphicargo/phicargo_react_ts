
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

export type MonthType = 'ENE' | 'FEB' | 'MAR' | 'ABR' | 'MAY' | 'JUN' | 'JUL' | 'AGO' | 'SEP' | 'OCT' | 'NOV' | 'DIC';
export interface OfYear {
  month: MonthType;
  podsSent: number;
}

export interface TravelStats {
  byBranch: ByBranch[];
  byClient: ByClient[];
  ofYear: OfYear[];
  monthMeta: number;
}
