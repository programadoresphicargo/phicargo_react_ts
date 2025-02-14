export interface ClientRevenueApi {
  client: string;
  amount: number;
}

export interface BranchRevenueApi {
  branch: string;
  amount: number;
}

export interface WaybillStatsApi {
  branch_revenues: BranchRevenueApi[];
  clients_revenues: ClientRevenueApi[];
}
