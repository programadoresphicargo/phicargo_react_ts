import { AxiosError } from 'axios';
import { DriverBonusAdapter } from '../adapters';
import type { DriverBonusMonth } from '../models';
import type { DriverBonusMonthApi } from '../models/api';
import odooApi from '@/api/odoo-api';

export class DriverBonusService {
  public static async getDriverBonusMonths(): Promise<DriverBonusMonth[]> {
    try {
      const response = await odooApi.get<DriverBonusMonthApi[]>(
        '/bonos_operadores/months',
      );
      return response.data.map(DriverBonusAdapter.toDriverBonusMonth);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al obtener los meses de bonos operadores',
        );
      }
      throw new Error('Error al obtener los meses de bonos operadores');
    }
  }
}
