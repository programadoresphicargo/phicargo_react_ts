import { AxiosError } from 'axios';
import { DriverStats } from '../models/driver-stats-models';
import { DriverStatsAdapter } from '../adapters/driver-stats-adapter';
import { DriverStatsApi } from '../models/api/driver-stats-models-api';
import odooApi from '../../core/api/odoo-api';

export class DriverStatsService {
  public static async getDriverStats(
    startDate: string,
    endDate: string,
  ): Promise<DriverStats> {
    const url = `/drivers/stats/?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<DriverStatsApi>(url);
      return DriverStatsAdapter.toDriverStats(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las estadísticas de operadores',
        );
      }
      throw new Error('Error al obtener las estadísticas de operadores');
    }
  }
}

