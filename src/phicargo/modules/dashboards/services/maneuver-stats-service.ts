import { AxiosError } from 'axios';
import type { ManeuverStats } from '../models/maneuvers-stats-model';
import { ManeuverStatsAdapter } from '../adapters/maneuver-stats-adapter';
import type { ManeuverStatsApi } from '../models/api/maneuvers-stats-model-api';
import odooApi from '../../core/api/odoo-api';

export class ManeuverStatsService {
  public static async getManeuversStats(
    startDate: string,
    endDate: string,
  ): Promise<ManeuverStats> {
    const url = `/maniobras/stats?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<ManeuverStatsApi>(url);
      return ManeuverStatsAdapter.toManeuverStats(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las estadísticas de maniobras',
        );
      }
      throw new Error('Error al obtener las estadísticas de maniobras');
    }
  }
}
