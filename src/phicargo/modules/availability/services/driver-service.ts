import { Driver, DriverEdit, DriverSimple2 } from '../models/driver-model';
import { DriverApi, DriverSimple2Api } from '../models/api/driver-model-api';
import {
  driverSimple2ToLocal,
  driverToLocal,
  driverUpdateToApi,
} from '../adapters/drivers/driver-mapper';

import { AxiosError } from 'axios';
import { UpdatebleItem } from '../../core/types/global-types';
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
          error.response?.data?.message || 'Error getting drivers',
        );
      }
      throw new Error('Error getting drivers');
    }
  }

  static async updateDriver({
    id,
    updatedItem,
  }: UpdatebleItem<DriverEdit>): Promise<Driver> {
    const driver = driverUpdateToApi(updatedItem);

    try {
      const response = await odooApi.patch<DriverApi>(`/drivers/${id}`, driver);
      return driverToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || 'Error updating driver',
        );
      }
      throw new Error('Error updating driver');
    }
  }

  static async getDrivers(): Promise<DriverSimple2[]> {
    try {
      const response = await odooApi.get<DriverSimple2Api[]>('/drivers/all/all');
      return response.data.map(driverSimple2ToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || 'Error getting drivers',
        );
      }
      throw new Error('Error getting drivers');
    }
  }
}

export default DriverServiceApi;
