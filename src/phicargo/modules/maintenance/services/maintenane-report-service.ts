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
  RecordUpdateComment,
  RecordUpdateCommentApi,
} from '../models';

import { AxiosError } from 'axios';
import { MaintenaceRecordAdapter } from '../adapters/mappers/register-mapper';
import { UpdatableItem } from '@/types';
import odooApi from '../../core/api/odoo-api';

/**
 * Maintenance Record Service API
 */
class MaintenanceRecordServiceApi {
  public static async getAllRecords(
    status: MaintenanceRecordStatus,
  ): Promise<MaintenanceRecord[]> {
    const url = `/maintenance-record/?status=${status}`;

    try {
      const response = await odooApi.get<MaintenanceRecordApi[]>(url);
      return response.data.map(
        MaintenaceRecordAdapter.maintenanceRecordToLocal,
      );
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

  public static async addRecord(
    record: MaintenanceRecordCreate,
  ): Promise<MaintenanceRecord> {
    const newRecord =
      MaintenaceRecordAdapter.maintenanceRecordCreateToApi(record);

    try {
      const response = await odooApi.post<MaintenanceRecordApi>(
        '/maintenance-record/',
        newRecord,
      );
      return MaintenaceRecordAdapter.maintenanceRecordToLocal(response.data);
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

  public static async editRecord({
    id,
    updatedItem,
  }: UpdatableItem<MaintenanceRecordUpdate>): Promise<MaintenanceRecord> {
    const newRecord =
      MaintenaceRecordAdapter.maintenanceRecordUpdateToApi(updatedItem);
    const url = `/maintenance-record/${id}`;
    try {
      const response = await odooApi.patch<MaintenanceRecordApi>(
        url,
        newRecord,
      );
      return MaintenaceRecordAdapter.maintenanceRecordToLocal(response.data);
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

  public static async getCommentsByRecordId(
    recordId: number,
  ): Promise<RecordComment[]> {
    const url = `/maintenance-record/${recordId}/comments`;
    try {
      const response = await odooApi.get<RecordCommentApi[]>(url);
      return response.data.map(MaintenaceRecordAdapter.recordCommentToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener comentarios',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  public static async getUpdateCommentsByRecordId(
    recordId: number,
  ): Promise<RecordUpdateComment[]> {
    const url = `/maintenance-record/${recordId}/update-comments`;
    try {
      const response = await odooApi.get<RecordUpdateCommentApi[]>(url);
      return response.data.map(
        MaintenaceRecordAdapter.recordUpdateCommentToLocal,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al obtener comentarios de actualización',
        );
      }
      throw new Error('Error inesperado con el servidor de actualización');
    }
  }

  public static async addComment({
    id,
    comment,
  }: {
    id: number;
    comment: RecordCommentCreate;
  }): Promise<RecordComment> {
    const newComment = MaintenaceRecordAdapter.recordCommentToApi(comment);

    try {
      const response = await odooApi.post<RecordCommentApi>(
        `/maintenance-record/${id}/comments`,
        newComment,
      );
      return MaintenaceRecordAdapter.recordCommentToLocal(response.data);
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
