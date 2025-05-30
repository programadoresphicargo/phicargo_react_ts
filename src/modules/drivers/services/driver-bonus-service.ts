import type { DriverBonus, DriverBonusMonth } from '../models';
import type { DriverBonusApi, DriverBonusMonthApi } from '../models/api';

import { AxiosError } from 'axios';
import { DriverBonusAdapter } from '../adapters';
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

  public static async getDriversBonus(
    month: number,
    year: number,
  ): Promise<DriverBonus[]> {
    try {
      const response = await odooApi.get<DriverBonusApi[]>(
        `/bonos_operadores/${month}/${year}`,
      );
      return response.data.map(DriverBonusAdapter.toDriverBonus);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al obtener los bonos por periodo',
        );
      }
      throw new Error('Error al obtener los bonos por periodo');
    }
  }

  public static async updateDriverBonus(data: DriverBonus[]) {
    const body = data.map(DriverBonusAdapter.toDriverBonusUpdateApi);

    try {
      const response = await odooApi.put('/bonos_operadores', body);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al actualizar los bonos por periodo',
        );
      }
      throw new Error('Error al actualizar los bonos por periodo');
    }
  }

  public static async createDriverBonus({
    month,
    year,
  }: {
    month: number;
    year: number;
  }) {
    try {
      const response = await odooApi.post(`/bonos_operadores/${month}/${year}`);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al crear los bonos por periodo',
        );
      }
      throw new Error('Error al crear los bonos por periodo');
    }
  }
}

