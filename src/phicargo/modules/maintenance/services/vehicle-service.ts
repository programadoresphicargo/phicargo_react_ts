import type { VehicleInfo, VehicleInfoApi } from '../models';

import { AxiosError } from 'axios';
import odooApi from '../../core/api/odoo-api';
import { vehicleInfoToLocal } from '../adapters/mappers/register-mapper';

/**
 * Vehicle Service API
 */
class VehicleServiceApi {
  /**
   * Method to get all vehicles
   * @returns Object of type VehicleInfo[]
   */
  public static async getVehicles(): Promise<VehicleInfo[]> {
    try {
      const response = await odooApi.get<VehicleInfoApi[]>(
        '/maintenance-record/vehicles/all',
      );
      return response.data.map(vehicleInfoToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener registros',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default VehicleServiceApi;
