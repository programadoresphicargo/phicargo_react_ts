import type { Vehicle, VehicleUpdate } from '../models/vehicle-model';
import {
  vehicleToLocal,
  vehicleUpdateToApi,
} from '../adapters/vehicles/vehicle-mapper';

import { AxiosError } from 'axios';
import { UpdatebleItem } from '../../core/types/global-types';
import type { VehicleApi } from '../models/api/vehicle-model-api';
import odooApi from '../../core/api/odoo-api';

class VehicleServiceApi {
  static async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await odooApi.get<VehicleApi[]>('/vehicles/');
      return response.data.map(vehicleToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async updateVehicle({
    id,
    updatedItem,
  }: UpdatebleItem<VehicleUpdate>): Promise<Vehicle> {
    const data = vehicleUpdateToApi(updatedItem);

    try {
      const response = await odooApi.patch<VehicleApi>(`/vehicles/${id}`, data);
      return vehicleToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }
}

export default VehicleServiceApi;

