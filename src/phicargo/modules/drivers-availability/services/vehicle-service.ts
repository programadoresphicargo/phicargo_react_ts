import { AxiosError } from 'axios';
import { VehicleRead } from '../models/vehicle-model';
import { VehicleReadApi } from '../models/api/vehicle-model-api';
import odooApi from '../../core/api/odoo-api';
import { vehicleReadToLocal } from '../adapters/vehicles/vehicle-mapper';

class VehicleServiceApi {
  static async getVehiclesRead(): Promise<VehicleRead[]> {
    try {
      const response = await odooApi.get<VehicleReadApi[]>(
        '/vehicles/available',
      );
      return response.data.map(vehicleReadToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }
}

export default VehicleServiceApi;
