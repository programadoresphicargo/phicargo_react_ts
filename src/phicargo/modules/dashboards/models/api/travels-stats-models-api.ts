import { MonthlyDataByClientApi, YearlyDataByClientApi } from "./waybill-stats-model-api";

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
  total_travels: number;
  travels_pending: number;
  travels_completed: number;
}

export interface ByConstructionTypeApi {
  trailer_construction_type: string;
  total_travels: number;
  travels_pending: number;
  travels_completed: number;
}

export interface ByCargoTypeApi {
  cargo_type: string;
  total_travels: number;
  travels_pending: number;
  travels_completed: number;
}

export interface OfYearApi {
  month: number;
  pods_sent: number;
}

export interface ByRouteApi {
  route: string;
  travels: number;
}

export interface ByCategoryApi {
  category: string;
  travels: number;
}

export interface MonthTravelsCountApi {
  month: number;
  travels: number;
}

export interface YearTravelsCountApi {
  year: number;
  travels: number;
}

export interface TravelStatsApi {
  month_meta: number;

  travels_by_branch: ByBranchApi[];
  travels_by_client: ByClientApi[];
  travels_by_traffic_executive: ByTrafficExecutiveApi[];
  travels_by_construction_type: ByConstructionTypeApi[];
  travels_by_cargo_type: ByCargoTypeApi[];
  travels_by_route: ByRouteApi[];
  travels_by_category: ByCategoryApi[];

  monthly_travels_count_summary: MonthTravelsCountApi[];
  past_year_monthly_travels_count_summary: MonthTravelsCountApi[];
  yearly_travels_count_summary: YearTravelsCountApi[];
}


export interface MonthlyTravelsByClientApi extends MonthlyDataByClientApi {
  total_travels: number;
}

export interface YearlyTravelsByClientApi extends YearlyDataByClientApi {
  total_travels: number;
}
