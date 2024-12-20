import type { Shift, ShiftApi } from '../models';

import { AxiosError } from 'axios';
import odooApi from '../../core/api/odoo-api';
import { shiftToLocal } from '../adapters/shift-adapter';

/**
 * Service to manage the shifts
 */
class ShiftServiceApi {
  /**
   * Get the list of shifts
   * @param branchId Id of the branch to get the shifts
   * @returns List of shifts
   */
  public static async getShifts(branchId: number = 1): Promise<Shift[]> {
    const url = `/shifts/?branch_id=${branchId}`;

    try {
      const response = await odooApi.get<ShiftApi[]>(url);
      return response.data.map(shiftToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener los turnos',
        );
      }
      throw new Error('Error al obtener los turnos');
    }
  }
}

export default ShiftServiceApi;

