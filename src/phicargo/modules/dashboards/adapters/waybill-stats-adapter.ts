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

import { MonthType } from '../models/travels-stats-models';

const months: MonthType[] = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
];

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
      monthlyContainersCountSummary: data.monthly_containers_count_summary.map(
        (item) => ({
          month: months[item.month - 1],
          containers: item.containers,
        }),
      ),
      pastYearMonthlyContainersCountSummary:
        data.past_year_monthly_containers_count_summary.map((item) => ({
          month: months[item.month - 1],
          containers: item.containers,
        })),
      yearlyContainersCountSummary: data.yearly_containers_count_summary.map(
        (item) => ({
          year: item.year,
          containers: item.containers,
        }),
      ),
      monthlyRevenue: data.monthly_revenues.map((item) => ({
        month: months[item.month - 1],
        amount: item.amount,
      })),
      pastYearMonthlyRevenues: data.past_year_monthly_revenues.map((item) => ({
        month: months[item.month - 1],
        amount: item.amount,
      })),
      yearlyRevenue: data.yearly_revenues.map((item) => ({
        year: item.year,
        amount: item.amount,
      })),
    };
  }
}

