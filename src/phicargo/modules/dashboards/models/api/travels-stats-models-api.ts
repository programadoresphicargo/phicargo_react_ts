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

export interface ByTrafficExecutiveApi {
  traffic_executive: string;
  travels: number;
}

export interface ByConstructionTypeApi {
  trailer_construction_type: string;
  travels: number;
}

export interface ByCargoTypeApi {
  cargo_type: string;
  travels: number;
}

export interface OfYearApi {
  month: number;
  pods_sent: number;
}

export interface TravelStatsApi {
  travels_by_branch: ByBranchApi[];
  travels_by_client: ByClientApi[];
  travels_by_traffic_executive: ByTrafficExecutiveApi[];
  travels_by_construction_type: ByConstructionTypeApi[];
  travels_by_cargo_type: ByCargoTypeApi[];
  travels_of_year: OfYearApi[];
  month_meta: number;
}

