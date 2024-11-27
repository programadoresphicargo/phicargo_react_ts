import { AxiosError } from 'axios';
import type { Vehicle } from '../models/vehicle-model';
import type { VehicleApi } from '../models/api/vehicle-model-api';
import odooApi from '../../core/api/odoo-api';
import { vehicleToLocal } from '../adapters/vehicles/vehicle-mapper';

class VehicleServiceApi {
  static async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await odooApi.get<VehicleApi[]>('/vehicles/');
      return response.data.map(vehicleToLocal);
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

