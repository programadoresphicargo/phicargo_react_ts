import type { MonthType } from './travels-stats-models';

export interface MonthlyDataByClient {
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

export interface YearlyDataByClient {
  client: string;
  average: number;

  2019: number;
  2020: number;
  2021: number;
  2022: number;
  2023: number;
  2024: number;
  2025: number;
  2026: number;
  2027: number;
  2028: number;
  2029: number;
  2030: number;
}

export interface MonthlyRevenueByClient extends MonthlyDataByClient {
  total: number;
}

export interface MontlyContainersByClient extends MonthlyDataByClient {
  containers: number;
}

export interface YearlyRevenueByClient extends YearlyDataByClient {
  total: number;
}

export interface YearlyContainersByClient extends YearlyDataByClient {
  containers: number;
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

