export interface ClientRevenue {
  client: string;
  amount: number;
}

export interface BranchRevenue {
  branch: string;
  amount: number;
}

export interface WaybillStats {
  branchRevenue: BranchRevenue[];
  clientRevenue: ClientRevenue[];
}
