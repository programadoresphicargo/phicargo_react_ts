import { AxiosError } from 'axios';
import type { VehicleRevenueProjection } from '../models';
import { VehicleRevenueProjectionAdapter } from '../adapters';
import type { VehicleRevenueProjectionApi } from '../models/api';
import odooApi from '../../core/api/odoo-api';

export class VehicleRevenueProjectionService {
  public static async getProjection(
    startDate: string,
    endDate: string,
  ): Promise<VehicleRevenueProjection[]> {
    const url = `/vehicles/revenue-projection/?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<VehicleRevenueProjectionApi[]>(url);

      return response.data.map(
        VehicleRevenueProjectionAdapter.toVehicleRevenueProjection,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener la proyección de ingresos de vehículos',
        );
      }
      throw new Error(
        'Error al obtener la proyección de ingresos de vehículos',
      );
    }
  }
}

