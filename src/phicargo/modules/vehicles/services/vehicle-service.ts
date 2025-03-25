import type { Vehicle, VehicleUpdate } from '../models';

import { AxiosError } from 'axios';
import type { UpdatableItem } from '@/types';
import { VehicleAdapter } from '../adapters/vehicle-adapter';
import type { VehicleApi } from '../models/api';
import odooApi from '../../core/api/odoo-api';

export class VehicleServiceApi {
  static async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await odooApi.get<VehicleApi[]>('/vehicles/');
      return response.data.map(VehicleAdapter.vehicleToLocal);
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
  }: UpdatableItem<VehicleUpdate>): Promise<Vehicle> {
    const data = VehicleAdapter.vehicleUpdateToApi(updatedItem);
    console.log(data);
    try {
      const response = await odooApi.patch<VehicleApi>(`/vehicles/${id}`, data);
      return VehicleAdapter.vehicleToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }
}

