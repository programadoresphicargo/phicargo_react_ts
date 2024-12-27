export interface ByBranchApi {
  branch: string;
  pods_sent: number;
  pods_pending: number;
  total: number;
}

export interface ByClientApi {
  client: string;
  travels: number;
}

export interface OfYearApi {
  month: number;
  pods_sent: number;
}

export interface TravelStatsApi {
  travels_by_branch: ByBranchApi[];
  travels_by_client: ByClientApi[];
  travels_of_year: OfYearApi[];
  month_meta: number;
}

