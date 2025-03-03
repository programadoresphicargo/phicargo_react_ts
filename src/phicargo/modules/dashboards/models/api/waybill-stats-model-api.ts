export interface ClientRevenueApi {
  client: string;
  amount: number;
}

export interface BranchRevenueApi {
  branch: string;
  amount: number;
}

export interface MonthRevenueApi {
  month: number;
  amount: number;
}

export interface YearRevenueApi {
  year: number;
  amount: number;
}

export interface MonthContainersCountApi {
  month: number;
  containers: number;
}

export interface YearContainersCountApi {
  year: number;
  containers: number;
}

export interface MonthlyRevenueByClientApi {
  client: string;
  total: number;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}

export interface WaybillStatsApi {
  branch_revenues: BranchRevenueApi[];
  clients_revenues: ClientRevenueApi[];
  monthly_containers_count_summary: MonthContainersCountApi[];
  past_year_monthly_containers_count_summary: MonthContainersCountApi[];
  yearly_containers_count_summary: YearContainersCountApi[];
  monthly_revenues: MonthRevenueApi[];
  past_year_monthly_revenues: MonthRevenueApi[];
  yearly_revenues: YearRevenueApi[];
}
