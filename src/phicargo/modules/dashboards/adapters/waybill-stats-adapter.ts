import type {
  BranchRevenue,
  ClientRevenue,
  MonthlyRevenueByClient,
  WaybillStats,
} from '../models/waybill-stats-model';
import type {
  BranchRevenueApi,
  ClientRevenueApi,
  MonthlyRevenueByClientApi,
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

  static toMonthlyRevenueByClient(
    data: MonthlyRevenueByClientApi,
  ): MonthlyRevenueByClient {
    return {
      client: data.client,
      total: data.total,
      january: data.january,
      february: data.february,
      march: data.march,
      april: data.april,
      may: data.may,
      june: data.june,
      july: data.july,
      august: data.august,
      september: data.september,
      october: data.october,
      november: data.november,
      december: data.december,
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
      monthlyRevenuesByClient: data.monthly_revenues_by_client.map(
        WaybillStatsAdapter.toMonthlyRevenueByClient,
      ),
    };
  }
}

