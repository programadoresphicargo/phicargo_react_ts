import type {
  BranchRevenue,
  ClientRevenue,
  MonthlyDataByClient,
  MonthlyRevenueByClient,
  MontlyContainersByClient,
  WaybillStats,
  YearlyContainersByClient,
  YearlyDataByClient,
  YearlyRevenueByClient,
} from '../models/waybill-stats-model';
import type {
  BranchRevenueApi,
  ClientRevenueApi,
  MonthlyDataByClientApi,
  MonthlyRevenueByClientApi,
  MontlyContainersByClientApi,
  WaybillStatsApi,
  YearlyContainersByClientApi,
  YearlyDataByClientApi,
  YearlyRevenueByClientApi,
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
  static toMonthlyDataByClient(
    data: MonthlyDataByClientApi,
  ): MonthlyDataByClient {
    return {
      client: data.client,
      average: data.average,
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

  static toYearlyDataByClient(data: YearlyDataByClientApi): YearlyDataByClient {
    return {
      client: data.client,
      average: data.average,
      2022: data.year_2022,
      2023: data.year_2023,
      2024: data.year_2024,
      2025: data.year_2025,
      2026: data.year_2026,
      2027: data.year_2027,
      2028: data.year_2028,
      2029: data.year_2029,
      2030: data.year_2030,
    };
  }

  static toMonthlyRevenueByClient(
    data: MonthlyRevenueByClientApi,
  ): MonthlyRevenueByClient {
    return {
      ...WaybillStatsAdapter.toMonthlyDataByClient(data),
      total: data.total,
    };
  }

  static toMonthlyContainersByClient(
    data: MontlyContainersByClientApi,
  ): MontlyContainersByClient {
    return {
      ...WaybillStatsAdapter.toMonthlyDataByClient(data),
      containers: data.containers,
    };
  }

  static toYearlyRevenueByClient(
    data: YearlyRevenueByClientApi,
  ): YearlyRevenueByClient {
    return {
      ...WaybillStatsAdapter.toYearlyDataByClient(data),
      total: data.total,
    };
  }

  static toYearlyContainersByClient(
    data: YearlyContainersByClientApi,
  ): YearlyContainersByClient {
    return {
      ...WaybillStatsAdapter.toYearlyDataByClient(data),
      containers: data.containers,
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
}

