import { AxiosError } from 'axios';
import { VehicleStats } from '../models/vehicles-stats-models';
import { VehicleStatsAdapter } from '../adapters/vehicle-stats-adapter';
import { VehicleStatsApi } from '../models/api/vehicles-stats-models-api';
import odooApi from '@/api/odoo-api';

export class VehiclesStatsService {
  public static async getVehiclesStats(
    startDate: string,
    endDate: string,
  ): Promise<VehicleStats> {
    const url = `/vehicles/stats/?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<VehicleStatsApi>(url);
      return VehicleStatsAdapter.vehicleStatsToLocal(response.data);
    } catch (error) {
      console.error(error);
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

