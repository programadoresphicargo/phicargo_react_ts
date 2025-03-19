import type { Driver, DriverEdit } from '../models/driver-model';
import {
  driverToLocal,
  driverUpdateToApi,
} from '../adapters/drivers/driver-mapper';

import { AxiosError } from 'axios';
import type { DriverApi } from '../models/api/driver-model-api';
import { UpdatableItem } from '@/types';
import odooApi from '../../core/api/odoo-api';

class DriverServiceApi {
  static async getAllDrivers(): Promise<Driver[]> {
    try {
      const response = await odooApi.get<DriverApi[]>('/drivers/');
      return response.data.map(driverToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error getting drivers',
        );
      }
      throw new Error('Error getting drivers');
    }
  }

  static async updateDriver({
    id,
    updatedItem,
  }: UpdatableItem<DriverEdit>): Promise<Driver> {
    const driver = driverUpdateToApi(updatedItem);

    try {
      const response = await odooApi.patch<DriverApi>(`/drivers/${id}`, driver);
      return driverToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error updating driver',
        );
      }
      throw new Error('Error updating driver');
    }
  }
}

export default DriverServiceApi;
