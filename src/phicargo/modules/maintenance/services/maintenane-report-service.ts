import type {
  MaintenanceRecord,
  MaintenanceRecordApi,
  MaintenanceRecordCreate,
  MaintenanceRecordStatus,
  MaintenanceRecordUpdate,
  RecordComment,
  RecordCommentApi,
  RecordCommentCreate,
  RecordStats,
} from '../models';
import {
  maintenanceRecordCreateToApi,
  maintenanceRecordToLocal,
  maintenanceRecordUpdateToApi,
  recordCommentToApi,
  recordCommentToLocal,
} from '../adapters/mappers/register-mapper';

import { AxiosError } from 'axios';
import { UpdatableItem } from '../../core/types/global-types';
import odooApi from '../../core/api/odoo-api';

/**
 * Maintenance Record Service API
 */
class MaintenanceRecordServiceApi {
  /**
   * Method to get all maintenance records
   * @param status Status of the maintenance record
   * @returns Array of maintenance records
   */
  public static async getAllRecords(
    status: MaintenanceRecordStatus,
  ): Promise<MaintenanceRecord[]> {
    const url = `/maintenance-record/?status=${status}`;

    try {
      const response = await odooApi.get<MaintenanceRecordApi[]>(url);
      return response.data.map(maintenanceRecordToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener registros',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to get a maintenance record by its id
   * @param id Id of the maintenance record
   * @returns Maintenance record
   */
  public static async addRecord(
    record: MaintenanceRecordCreate,
  ): Promise<MaintenanceRecord> {
    const newRecord = maintenanceRecordCreateToApi(record);

    try {
      const response = await odooApi.post<MaintenanceRecordApi>(
        '/maintenance-record/',
        newRecord,
      );
      return maintenanceRecordToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al crear registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to edit a maintenance record
   * @param param0 Object with the id of the record to edit and the updated item
   * @returns Object with the updated record
   */
  public static async editRecord({
    id,
    updatedItem,
  }: UpdatableItem<MaintenanceRecordUpdate>): Promise<MaintenanceRecord> {
    const newRecord = maintenanceRecordUpdateToApi(updatedItem);
    const url = `/maintenance-record/${id}`;
    try {
      const response = await odooApi.patch<MaintenanceRecordApi>(url, newRecord);
      return maintenanceRecordToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al editar registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to get the comments of a maintenance record
   * @param recordId ID of the record to get the comments
   * @returns Array of comments
   */
  public static async getCommentsByRecordId(
    recordId: number,
  ): Promise<RecordComment[]> {
    const url = `/maintenance-record/${recordId}/comments`;
    try {
      const response = await odooApi.get<RecordCommentApi[]>(url);
      return response.data.map(recordCommentToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener comentarios',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to add a comment to a maintenance record
   * @param param0 Object with the id of the record to add the comment and the comment
   * @returns Object with the added comment
   */
  public static async addComment({
    id,
    comment,
  }: {
    id: number;
    comment: RecordCommentCreate;
  }): Promise<RecordComment> {
    const newComment = recordCommentToApi(comment);

    try {
      const response = await odooApi.post<RecordCommentApi>(
        `/maintenance-record/${id}/comments`,
        newComment,
      );
      return recordCommentToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al crear comentario',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to get the count of registers
   * @returns Object with the count of registers
   */
  public static async getRecordsCount(): Promise<RecordStats> {
    const url = '/maintenance-record/count/all';
    try {
      const response = await odooApi.get<RecordStats>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al obtener el conteo de registros',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default MaintenanceRecordServiceApi;
