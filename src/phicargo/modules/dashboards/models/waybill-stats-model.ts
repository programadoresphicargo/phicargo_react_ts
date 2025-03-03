import type { MonthType } from './travels-stats-models';

export interface ClientRevenue {
  client: string;
  amount: number;
}

export interface BranchRevenue {
  branch: string;
  amount: number;
}

export interface MonthRevenue {
  month: MonthType;
  amount: number;
}

export interface YearRevenue {
  year: number;
  amount: number;
}

export interface MonthContainersCount {
  month: MonthType;
  containers: number;
}

export interface YearContainersCount {
  year: number;
  containers: number;
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
  monthlyContainersCountSummary: MonthContainersCount[];
  pastYearMonthlyContainersCountSummary: MonthContainersCount[];
  yearlyContainersCountSummary: YearContainersCount[];
  monthlyRevenue: MonthRevenue[];
  pastYearMonthlyRevenues: MonthRevenue[];
  yearlyRevenue: YearRevenue[];
}

