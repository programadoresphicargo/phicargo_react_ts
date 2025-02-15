export interface ClientRevenueApi {
  client: string;
  amount: number;
}

export interface BranchRevenueApi {
  branch: string;
  amount: number;
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
  monthly_revenues_by_client: MonthlyRevenueByClientApi[];
}
