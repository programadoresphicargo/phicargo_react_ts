import { AxiosError } from 'axios';
import type { Maneuver } from '../models';
import type { ManeuverApi } from '../models/api';
import { maneuverToLocal } from '../adapters';
import odooApi from '../../core/api/odoo-api';

export class DriverService {
  public static async getManeuversByDriverId(
    driverId: number,
  ): Promise<Maneuver[]> {
    const url = `/maniobras/by_driver/${driverId}`;

    try {
      const response = await odooApi.get<ManeuverApi[]>(url);
      return response.data.map(maneuverToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener los maniobras',
        );
      }
      throw new Error('Error al obtener los maniobras');
    }
  }
}

