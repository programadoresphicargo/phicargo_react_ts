import { AxiosError } from 'axios';
import type { DepartureAndArrivalStats } from '../models/departure-and-arrival-models';
import type { DepartureAndArrivalStatsApi } from '../models/api/departure-and-arrival-models';
import { departureAndArrivalStatsToLocal } from '../adapters/departure-and-arrival-adapter';
import odooApi from '@/api/odoo-api';

export class DepartureAndArrivalService {
  public static async getDepartureAndArrivalStats(
    startDate: string,
    endDate: string,
  ): Promise<DepartureAndArrivalStats> {
    const url = `/tms_travel/departure_and_arrival_stats?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<DepartureAndArrivalStatsApi>(url);
      return departureAndArrivalStatsToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las estadísticas de llegadas tarde',
        );
      }
      throw new Error('Error al obtener las estadísticas de llegadas tarde');
    }
  }
}

