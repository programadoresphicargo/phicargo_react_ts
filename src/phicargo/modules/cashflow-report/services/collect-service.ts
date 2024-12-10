import type {
  CollectRegister,
  CollectRegisterApi,
  CollectRegisterCreate,
  Confirmation,
} from '../models';
import {
  collectConfirmationToApi,
  collectRegisterToApi,
  collectRegisterToApiFull,
  collectRegisterToLocal,
} from '../adapters';

import { AxiosError } from 'axios';
import { UpdatableItem } from '../../core/types/global-types';
import odooApi from '../../core/api/odoo-api';

/**
 * API Service for Collect Module
 */
class CollectServiceApi {
  /**
   * Method to get the collect registers of a week
   * @param weekId ID of the week to get the collect registers
   * @returns Array of Collect Registers
   */
  public static async getCollectRegisterByWeekId(
    weekId: number,
  ): Promise<CollectRegister[]> {
    const url = `/accounting_report/collects?week_id=${weekId}`;
    try {
      const response = await odooApi<CollectRegisterApi[]>(url);
      return response.data.map(collectRegisterToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al obtener registros',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to create a new collect register
   * @param newRegister Object with the data of the new register
   * @returns Object with the data of the created register
   */
  public static async createRegister(
    newRegister: CollectRegisterCreate,
  ): Promise<CollectRegister> {
    const body = collectRegisterToApi(newRegister);
    try {
      const response = await odooApi.post<CollectRegisterApi>(
        '/accounting_report/collects',
        body,
      );
      return collectRegisterToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al crear registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to update a collect register
   * @param param0 Object with the data of the register to update
   * @returns Object with the data of the updated register
   */
  public static async updateRegister({
    id,
    updatedItem,
  }: UpdatableItem<Partial<CollectRegisterCreate>>): Promise<CollectRegister> {
    const body = collectRegisterToApiFull(updatedItem as CollectRegister);
    try {
      const response = await odooApi.put<CollectRegisterApi>(
        `/accounting_report/collects/${id}`,
        body,
      );
      return collectRegisterToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al actualizar registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to delete a collect register
   * @param registerId ID of the register to delete
   * @returns True if the register was deleted
   */
  public static async deleteRegister(registerId: number): Promise<boolean> {
    try {
      await odooApi.delete(`/accounting_report/collects/${registerId}`);
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al eliminar registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to confirm a collect register
   * @param confirmation Object with the data of the confirmation
   * @returns Object with the data of the created confirmation
   */
  public static async confirmCollect(
    confirmation: Confirmation,
  ): Promise<CollectRegister> {
    const body = collectConfirmationToApi(confirmation);
    try {
      const response = await odooApi.post<CollectRegisterApi>(
        `/accounting_report/collects/${confirmation.itemId}/confirm`,
        body,
      );
      return collectRegisterToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al eliminar registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to load the previous week registers to the active week
   * @param param0 Object with the data of the previous week and the active week
   * @returns Object with the data of the created confirmation
   */
  public static async loadPreviousWeek({
    previousWeekId,
    activeWeekId,
  }: {
    previousWeekId: number;
    activeWeekId: number;
  }): Promise<boolean> {
    try {
      await odooApi.post<number>(
        `/accounting_report/collects/load_previous/collects?previous_week_id=${previousWeekId}&new_week_id=${activeWeekId}`,
      );
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al cargar registros',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default CollectServiceApi;
