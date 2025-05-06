import type { DayOff, DayOffCreate } from '../models';

import { AxiosError } from 'axios';
import { DayOffAdapter } from '../adapters';
import type { DayOffApi } from '../models/api';
import odooApi from '@/api/odoo-api';

export class DayOffService {
  public static async createDayOff(dayOff: DayOffCreate): Promise<DayOff> {
    const body = DayOffAdapter.toDayOffCreateApi(dayOff);

    try {
      const response = await odooApi.post<DayOffApi>('/day-off', body);
      return DayOffAdapter.toDayOff(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw new Error('Error al crear el día inhábil');
    }
  }

  public static async getDaysOff(
    startDate: string,
    endDate: string
  ): Promise<DayOff[]> {
    try {
      const response = await odooApi.get<DayOffApi[]>('/day-off', {
        params: { start_date: startDate, end_date: endDate },
      });
      return response.data.map(DayOffAdapter.toDayOff);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw new Error('Error al obtener los días inhábiles');
    }
  }
}

