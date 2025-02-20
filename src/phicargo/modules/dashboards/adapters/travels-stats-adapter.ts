import type {
  ByBranch,
  ByCargoType,
  ByCategory,
  ByClient,
  ByConstructionType,
  ByRoute,
  ByTrafficExecutive,
  MonthType,
  OfYear,
  TravelStats,
} from '../models/travels-stats-models';
import type {
  ByBranchApi,
  ByCargoTypeApi,
  ByCategoryApi,
  ByConstructionTypeApi,
  ByRouteApi,
  ByTrafficExecutiveApi,
  OfYearApi,
  TravelStatsApi,
} from '../models/api/travels-stats-models-api';

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

const OfYearToLocal = (ofYear: OfYearApi): OfYear => ({
  month: months[ofYear.month - 1],
  podsSent: ofYear.pods_sent,
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
  byBranch: stats.travels_by_branch.map(byBranchToLocal),
  byClient: stats.travels_by_client.map(ByClientToLocal),
  byTrafficExecutive: stats.travels_by_traffic_executive.map(
    ByTrafficExecutiveToLocal,
  ),
  byConstructionType: stats.travels_by_construction_type.map(
    byConstructionTypeToLocal,
  ),
  byCargoType: stats.travels_by_cargo_type.map(byCargoTypeToLocal),
  ofYear: stats.travels_of_year.map(OfYearToLocal),
  monthMeta: stats.month_meta,

  byRoute: stats.travels_by_route.map(byRouteToLocal),
  byCategory: stats.travels_by_category.map(byCategoryToLocal),
});

