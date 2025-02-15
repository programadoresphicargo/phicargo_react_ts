export interface ClientRevenue {
  client: string;
  amount: number;
}

export interface BranchRevenue {
  branch: string;
  amount: number;
}

export interface MonthlyRevenueByClient {
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

export interface WaybillStats {
  branchRevenue: BranchRevenue[];
  clientRevenue: ClientRevenue[];
  monthlyRevenuesByClient: MonthlyRevenueByClient[];
}

