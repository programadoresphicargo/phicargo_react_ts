import { Maneuver, ManeuverApi } from '../../core/models';
import type {
  Queue,
  QueueCreate,
  Shift,
  ShiftApi,
  ShiftArchive,
  ShiftCreate,
  ShiftEdit,
  ShiftReorder,
} from '../models';
import {
  shiftCreateToApi,
  shiftEditToApi,
  shiftReorderToApi,
  shiftToLocal,
} from '../adapters/shift-adapter';
import {
  shiftQueueCreateToApi,
  shiftQueueToLocal,
} from '../adapters/shift-queue-adapter';

import { AxiosError } from 'axios';
import { QueueApi } from '../models/api/shift-queue-model-api';
import { UpdatableItem } from '@/types';
import { maneuverToLocal } from '../../core/adapters/maneuver-adapters';
import odooApi from '@/api/odoo-api';

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
  }: UpdatableItem<ShiftArchive>): Promise<Shift[]> {
    const url = `/shifts/${id}/archive`;
    const data = updatedItem;

    try {
      const response = await odooApi.put<ShiftApi[]>(url, data);
      return response.data.map(shiftToLocal);
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
   * Method to reorder the shifts
   * @param shifts List of shifts to reorder
   */
  public static async reorderShifts(shifts: ShiftReorder[]) {
    const data = shifts.map(shiftReorderToApi);

    try {
      const response = await odooApi.patch('/shifts/shifts/reorder', data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al reordenar los turnos',
        );
      }
      throw new Error('Error al reordenar los turnos');
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

  /**
   * Method to get all the queues
   * @returns List of queues
   */
  public static async getAllQueues(branchId: number = 1): Promise<Queue[]> {
    const url = `/shifts/queue/all?branch_id=${branchId}`;

    try {
      const response = await odooApi.get<QueueApi[]>(url);
      return response.data.map(shiftQueueToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener las colas',
        );
      }
      throw new Error('Error al obtener las colas');
    }
  }

  /**
   * Method to create a new queue
   * @param param0 Object with the data to create a new queue
   * @returns Object with the data of the new queue
   */
  public static async createShiftQueue({
    shiftId,
    queueData,
  }: {
    shiftId: number;
    queueData: QueueCreate;
  }): Promise<Queue> {
    const url = `/shifts/${shiftId}/queue`;
    const data = shiftQueueCreateToApi(queueData);
    try {
      const response = await odooApi.post(url, data);
      return shiftQueueToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al encolar el turno',
        );
      }
      throw new Error('Error al encolar el turno');
    }
  }

  /**
   * Method to release a queue
   * @param queueId ID for the queue to release
   */
  public static async releaseQueue(queueId: number): Promise<void> {
    const url = `/shifts/queue/${queueId}/release`;

    try {
      await odooApi.put(url);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al liberar el turno',
        );
      }
      throw new Error('Error al liberar el turno');
    }
  }

  /**
   * Method to get the maneuvers of a driver
   * @param driverId ID of the driver to get the maneuvers
   * @returns Array of maneuvers
   */
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

export default ShiftServiceApi;

