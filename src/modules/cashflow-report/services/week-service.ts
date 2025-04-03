import { AxiosError } from 'axios';
import odooApi from '@/api/odoo-api';
import { weekToApi } from '../adapters';

/**
 * API Service for Week Module
 */
class WeekServiceApi {
  /**
   * Mathod to change the week
   * @param param0 Object with the start and end date of the week
   * @returns ID of the new week
   */
  public static async changeWeek({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<number> {
    const body = weekToApi(startDate, endDate);
    try {
      const response = await odooApi.get<number>(
        `/accounting_report/week?start_date=${body.start_date}&end_date=${body.end_date}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al cambiar semana',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default WeekServiceApi;
