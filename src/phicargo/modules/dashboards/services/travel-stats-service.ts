import { AxiosError } from 'axios';
import type { TravelStats } from '../models/travels-stats-models';
import { TravelStatsApi } from '../models/api/travels-stats-models-api';
import odooApi from '../../core/api/odoo-api';
import { travelsStatsToLocal } from '../adapters/travels-stats-adapter';

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
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las estadísticas de viajes',
        );
      }
      throw new Error('Error al obtener las estadísticas de viajes');
    }
  }
}

export default TravelStatsServiceApi;

