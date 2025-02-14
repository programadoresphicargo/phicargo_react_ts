import type {
  BranchRevenue,
  ClientRevenue,
  WaybillStats,
} from '../models/waybill-stats-model';
import type {
  BranchRevenueApi,
  ClientRevenueApi,
  WaybillStatsApi,
} from '../models/api/waybill-stats-model-api';

export class WaybillStatsAdapter {
  static toBranchRevenue(data: BranchRevenueApi): BranchRevenue {
    return {
      branch: data.branch,
      amount: data.amount,
    };
  }

  static toClientRevenue(data: ClientRevenueApi): ClientRevenue {
    return {
      client: data.client,
      amount: data.amount,
    };
  }

  public static toWaybilStats(data: WaybillStatsApi): WaybillStats {
    return {
      branchRevenue: data.branch_revenues.map(
        WaybillStatsAdapter.toBranchRevenue,
      ),
      clientRevenue: data.clients_revenues.map(
        WaybillStatsAdapter.toClientRevenue,
      ),
    };
  }
}

