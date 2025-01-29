import { AxiosError } from 'axios';
import { VehicleStats } from '../models/vehicles-stats-models';
import { VehicleStatsApi } from '../models/api/vehicles-stats-models-api';
import odooApi from '../../core/api/odoo-api';
import { vehicleStatsToLocal } from '../adapters/vehicle-stats-adapter';

export class VehiclesStatsService {
  public static async getVehiclesStats(
    startDate: string,
    endDate: string,
  ): Promise<VehicleStats> {
    const url = `/vehicles/stats/?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<VehicleStatsApi>(url);
      return vehicleStatsToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las estadísticas de unidades',
        );
      }
      throw new Error('Error al obtener las estadísticas de unidades');
    }
  }
}
