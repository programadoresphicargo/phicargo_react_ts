import type {
  ByBranch,
  ByCargoType,
  ByCategory,
  ByClient,
  ByConstructionType,
  ByRoute,
  ByTrafficExecutive,
  MonthTravelsCount,
  MonthType,
  MonthlyTravelsByClient,
  TravelStats,
  YearTravelsCount,
  YearlyTravelsByClient,
} from '../models/travels-stats-models';
import type {
  ByBranchApi,
  ByCargoTypeApi,
  ByCategoryApi,
  ByConstructionTypeApi,
  ByRouteApi,
  ByTrafficExecutiveApi,
  MonthTravelsCountApi,
  MonthlyTravelsByClientApi,
  TravelStatsApi,
  YearTravelsCountApi,
} from '../models/api/travels-stats-models-api';

import { WaybillStatsAdapter } from './waybill-stats-adapter';
import { YearlyTravelsByClientApi } from '../models/api/travels-stats-models-api';

const getBranchCode = (branch: string): string => {
  branch = branch.toLowerCase();
  if (branch.includes('ver')) return 'VER';
  if (branch.includes('man')) return 'MZN';
  if (branch.includes('méx') || branch.includes('mex')) return 'MX';
  return branch;
};

const byBranchToLocal = (byBranch: ByBranchApi): ByBranch => ({
  branch: byBranch.branch,
  code: getBranchCode(byBranch.branch),
  podsSent: byBranch.pods_sent,
  podsPending: byBranch.pods_pending,
  total: byBranch.total,
});

const ByClientToLocal = (byClient: ByClient): ByClient => ({
  client: byClient.client,
  travels: byClient.travels,
});

const ByTrafficExecutiveToLocal = (
  byTrafficExecutive: ByTrafficExecutiveApi,
): ByTrafficExecutive => ({
  trafficExecutive: byTrafficExecutive.traffic_executive,
  totalTravels: byTrafficExecutive.total_travels,
  travelsPending: byTrafficExecutive.travels_pending,
  travelsCompleted: byTrafficExecutive.travels_completed,
});

const byConstructionTypeToLocal = (
  byConstructionType: ByConstructionTypeApi,
): ByConstructionType => ({
  constructionType: byConstructionType.trailer_construction_type,
  totalTravels: byConstructionType.total_travels,
  travelsPending: byConstructionType.travels_pending,
  travelsCompleted: byConstructionType.travels_completed,
});

const byCargoTypeToLocal = (byCargoType: ByCargoTypeApi): ByCargoType => ({
  cargoType: byCargoType.cargo_type,
  totalTravels: byCargoType.total_travels,
  travelsCompleted: byCargoType.travels_completed,
  travelsPending: byCargoType.travels_pending,
});

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

const monthTravelsCountToLocal = (
  data: MonthTravelsCountApi,
): MonthTravelsCount => ({
  month: months[data.month - 1],
  travels: data.travels,
});

const yearTravelsCountToLocal = (
  data: YearTravelsCountApi,
): YearTravelsCount => ({
  year: data.year,
  travels: data.travels,
});

const byRouteToLocal = (data: ByRouteApi): ByRoute => ({
  route: data.route,
  travels: data.travels,
});

const byCategoryToLocal = (data: ByCategoryApi): ByCategory => ({
  category: data.category,
  travels: data.travels,
});

/**
 * Mapper function to convert the travels stats from the API to the local model
 * @param stats Object with the data of the travels stats
 * @returns Object with the data of the travels stats
 */
export const travelsStatsToLocal = (stats: TravelStatsApi): TravelStats => ({
  monthMeta: stats.month_meta,

  byBranch: stats.travels_by_branch.map(byBranchToLocal),
  byClient: stats.travels_by_client.map(ByClientToLocal),
  byTrafficExecutive: stats.travels_by_traffic_executive.map(
    ByTrafficExecutiveToLocal,
  ),
  byConstructionType: stats.travels_by_construction_type.map(
    byConstructionTypeToLocal,
  ),
  byCargoType: stats.travels_by_cargo_type.map(byCargoTypeToLocal),
  byRoute: stats.travels_by_route.map(byRouteToLocal),
  byCategory: stats.travels_by_category.map(byCategoryToLocal),

  monthlyTravelsCountSummary: stats.monthly_travels_count_summary.map(
    monthTravelsCountToLocal,
  ),
  pastYearTravelsCountSummary:
    stats.past_year_monthly_travels_count_summary.map(monthTravelsCountToLocal),
  yearTravelsCountSummary: stats.yearly_travels_count_summary.map(
    yearTravelsCountToLocal,
  ),
});

export const toMonthlyTravelsByClient = (
  data: MonthlyTravelsByClientApi,
): MonthlyTravelsByClient => {
  return {
    ...WaybillStatsAdapter.toMonthlyDataByClient(data),
    totalTravels: data.total_travels,
  };
};

export const toYearlyTravelsByClient = (
  data: YearlyTravelsByClientApi,
): YearlyTravelsByClient => {
  return {
    ...WaybillStatsAdapter.toYearlyDataByClient(data),
    totalTravels: data.total_travels,
  };
};

