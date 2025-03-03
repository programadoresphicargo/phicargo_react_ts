export interface MonthlyDataByClientApi {
  client: string;
  average: number;
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

export interface YearlyDataByClientApi {
  client: string;
  average: number;
  year_2022: number;
  year_2023: number;
  year_2024: number;
  year_2025: number;
  year_2026: number;
  year_2027: number;
  year_2028: number;
  year_2029: number;
  year_2030: number;
}

export interface MonthlyRevenueByClientApi extends MonthlyDataByClientApi {
  total: number;
}

export interface MontlyContainersByClientApi extends MonthlyDataByClientApi {
  containers: number;
}

export interface YearlyRevenueByClientApi extends YearlyDataByClientApi {
  total: number;
}

export interface YearlyContainersByClientApi extends YearlyDataByClientApi {
  containers: number;
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

