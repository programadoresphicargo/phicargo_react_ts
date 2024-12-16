import type { Record, RecordUpdate } from '../models/record-model';
import { recordToLocal, recordUpdateToApi } from '../adapters/record-adapter';

import { AxiosError } from 'axios';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import type { RecordApi } from '../models/api/record-model';
import type { UpdatableItem } from '../../core/types/global-types';
import dayjs from 'dayjs';
import odooApi from '../../core/api/odoo-api';

export interface IRecordService {
  /**
   * Obtiene los registros
   * @returns Array con los registros
   */
  getRecords: (monthRange: DateRange, branchId: number) => Promise<Record[]>;
  /**
   * Edita un registro
   * @param updateItem Objeto con el id del registro a editar y los datos a actualizar
   * @returns Objeto con los datos del registro editado
   */
  editRecord: (updateItem: UpdatableItem<RecordUpdate>) => Promise<Record>;
}

class RecordService implements IRecordService {
  public async getRecords(
    monthRange: DateRange,
    branchId: number,
  ): Promise<Record[]> {
    const startDate = dayjs(monthRange[0]).format('YYYY-MM-DD');
    const endDate = dayjs(monthRange[1]).format('YYYY-MM-DD');

    const url = `/daily_operations_report/?start_date=${startDate}&end_date=${endDate}&branch_id=${branchId}`;

    try {
      const response = await odooApi.get<RecordApi[]>(url);
      return response.data.map(recordToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener los registros',
        );
      }
      throw new Error('Error al obtener los registros');
    }
  }

  public async editRecord({
    id,
    updatedItem,
  }: UpdatableItem<RecordUpdate>): Promise<Record> {
    const newRecord = recordUpdateToApi(updatedItem);
    const url = `/daily_operations_report/${id}`;
    try {
      const response = await odooApi.put<RecordApi>(url, newRecord);
      return recordToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al editar el registro',
        );
      }
      throw new Error('Error al editar el registro');
    }
  }

  public async updateRecordDataById({
    branchId,
    date,
  }: {
    branchId: number;
    date: string;
  }): Promise<Record> {
    const url = `/daily_operations_report/update_units/${branchId}?record_date=${date}`;
    try {
      const response = await odooApi.put<RecordApi>(url);
      return recordToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al editar el registro',
        );
      }
      throw new Error('Error al editar el registro');
    }
  }
}

export default RecordService;
