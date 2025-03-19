import type { Driver, DriverEdit, Maneuver } from '../models';
import { DriverAdapter, maneuverToLocal } from '../adapters';
import type { DriverApi, ManeuverApi } from '../models/api';

import { AxiosError } from 'axios';
import { UpdatableItem } from '@/types';
import odooApi from '../../core/api/odoo-api';

export class DriverService {
  static async getAllDrivers(): Promise<Driver[]> {
    try {
      const response = await odooApi.get<DriverApi[]>('/drivers/');
      return response.data.map(DriverAdapter.driverToLocal);
    } catch (error) {
      console.error(error);
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
    const driver = DriverAdapter.driverUpdateToApi(updatedItem);

    try {
      const response = await odooApi.patch<DriverApi>(`/drivers/${id}`, driver);
      return DriverAdapter.driverToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error updating driver',
        );
      }
      throw new Error('Error updating driver');
    }
  }

  public static async getManeuversByDriverId(
    driverId: number,
  ): Promise<Maneuver[]> {
    const url = `/maniobras/by_driver/${driverId}`;

    try {
      const response = await odooApi.get<ManeuverApi[]>(url);
      return response.data.map(maneuverToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener los maniobras',
        );
      }
      throw new Error('Error al obtener los maniobras');
    }
  }

  public static async changeDriverPassword({
    driverId,
    password,
  }: {
    driverId: number;
    password: string;
  }): Promise<void> {
    const url = `/drivers/drivers/${driverId}/password?new_password=${password}`;

    try {
      await odooApi.put(url);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al cambiar la contraseña',
        );
      }
      throw new Error('Error al cambiar la contraseña');
    }
  }
}

