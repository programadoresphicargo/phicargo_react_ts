import type {
  MonthlyTravelsByClient,
  TravelStats,
  YearlyTravelsByClient,
} from '../models/travels-stats-models';
import {
  MonthlyTravelsByClientApi,
  TravelStatsApi,
  YearlyTravelsByClientApi,
} from '../models/api/travels-stats-models-api';
import {
  toMonthlyTravelsByClient,
  toYearlyTravelsByClient,
  travelsStatsToLocal,
} from '../adapters/travels-stats-adapter';

import { AxiosError } from 'axios';
import odooApi from '@/api/odoo-api';

/**
 * Service class to manage the travel stats
 */
class TravelStatsServiceApi {
  /**
   * Method to get the travel stats
   * @param startDate Start date to filter the stats
   * @param endDate End date to filter the stats
   * @returns Object with the data of the travels stats
   */
  public static async getTravelStats(
    startDate: string,
    endDate: string,
    companyId: number | null,
    branchId: number | null,
  ): Promise<TravelStats> {
    let url = `/tms_travel/stats?start_date=${startDate}&end_date=${endDate}`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }

    try {
      const response = await odooApi.get<TravelStatsApi>(url);
      return travelsStatsToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las estadísticas de viajes',
        );
      }
      throw new Error('Error al obtener las estadísticas de viajes');
    }
  }

  public static async getMonthlyTravelsByClient(
    startDate: string,
    endDate: string,
    companyId: number | null,
    branchId: number | null,
  ): Promise<MonthlyTravelsByClient[]> {
    let url = `/tms_travel/stats/monthly-travels-by-client?start_date=${startDate}&end_date=${endDate}`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }
    try {
      const response = await odooApi.get<MonthlyTravelsByClientApi[]>(url);
      return response.data.map(toMonthlyTravelsByClient);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los viajes mensuales por cliente',
        );
      }
      throw new Error('Error al obtener los viajes mensuales por cliente');
    }
  }

  public static async getYearlyTravelsByClient(
    companyId: number | null,
    branchId: number | null,
  ): Promise<YearlyTravelsByClient[]> {
    let url = `/tms_travel/stats/yearly-travels-by-client?`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }
    try {
      const response = await odooApi.get<YearlyTravelsByClientApi[]>(url);
      return response.data.map(toYearlyTravelsByClient);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los viajes anuales por cliente',
        );
      }
      throw new Error('Error al obtener los viajes anuales por cliente');
    }
  }
}

export default TravelStatsServiceApi;

