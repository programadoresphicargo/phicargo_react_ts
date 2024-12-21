import type {
  Shift,
  ShiftApi,
  ShiftArchive,
  ShiftCreate,
  ShiftEdit,
} from '../models';
import {
  shiftCreateToApi,
  shiftEditToApi,
  shiftToLocal,
} from '../adapters/shift-adapter';

import { AxiosError } from 'axios';
import { UpdatableItem } from '../../core/types/global-types';
import odooApi from '../../core/api/odoo-api';

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

  /**
   * Method to edit a shift
   * @param param0 Object with the data to create a new shift
   * @returns Shift edited
   */
  public static async editShift({
    id,
    updatedItem,
  }: UpdatableItem<ShiftEdit>): Promise<Shift> {
    const url = `/shifts/${id}`;
    const data = shiftEditToApi(updatedItem);

    try {
      const response = await odooApi.put<ShiftApi>(url, data);
      return shiftToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al editar el turno',
        );
      }
      throw new Error('Error al editar el turno');
    }
  }

  /**
   * Method to archive a shift
   * @param param0 Object with the data to archive a shift
   */
  public static async archiveShift({
    id,
    updatedItem,
  }: UpdatableItem<ShiftArchive>): Promise<void> {
    const url = `/shifts/${id}/archive`;
    const data = updatedItem;

    try {
      await odooApi.put(url, data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al archivar el turno',
        );
      }
      throw new Error('Error al archivar el turno');
    }
  }

  /**
   * Method to create a new shift
   * @param data Object with the data to create a new shift
   * @returns Object with the data of the new shift
   */
  public static async createShift(data: ShiftCreate): Promise<Shift> {
    const shift = shiftCreateToApi(data);

    try {
      const response = await odooApi.post<ShiftApi>(
        '/shifts/create/manual',
        shift,
      );
      return shiftToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al crear el turno',
        );
      }
      throw new Error('Error al crear el turno');
    }
  }
}

export default ShiftServiceApi;

