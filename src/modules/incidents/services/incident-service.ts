import { Incident, IncidentCreate, IncidentUpdate } from '../models';

import { AxiosError } from 'axios';
import odooApi from '@/api/odoo-api';
import { IncidentAdapter } from '../adapters';
import { IncidentApi } from '../models/api';
import { uploadFiles } from '@/modules/core/services';
import { UpdatableItem } from '@/types';

/**
 * Service to manage the incidents
 */
export class IncidentsService {
  public static async getAllIncidents(
    startDate?: string,
    endDate?: string,
  ): Promise<Incident[]> {
    let url = '/drivers/incidents/';

    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    try {
      const response = await odooApi.get<IncidentApi[]>(url, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data.map(IncidentAdapter.driverIncidentToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener las incidencias',
        );
      }
      throw new Error('Error al obtener las incidencias');
    }
  }

  public static async getIncidentById(id: number): Promise<Incident> {
    const url = `/drivers/incidents/${id}`;
    try {
      const response = await odooApi.get<IncidentApi>(url);
      return IncidentAdapter.driverIncidentToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener la incidencia',
        );
      }
      throw new Error('Error al obtener la incidencia');
    }
  }

  public static async getIncidentsByDriver(
    driverId: number,
  ): Promise<Incident[]> {
    const url = `/drivers/${driverId}/incidents`;
    try {
      const response = await odooApi.get<IncidentApi[]>(url);
      return response.data.map(IncidentAdapter.driverIncidentToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
          'Error al obtener las incidencias del operador',
        );
      }
      throw new Error('Error al obtener las incidencias del operador');
    }
  }

  public static async createIncident({
    driverId,
    incident,
    inspectionid,
    files = [],
  }: {
    driverId: number;
    incident: IncidentCreate;
    inspectionid?: number;
    files?: File[];
  }): Promise<Incident> {
    const url = inspectionid
      ? `/drivers/${driverId}/incidents?inspection_id=${inspectionid}`
      : `/drivers/${driverId}/incidents`;
    const data = {
      ...IncidentAdapter.driverIncidentToApi(incident),
      inspection_id: inspectionid, // 👈 lo agregas aquí
    };
    try {
      const response = await odooApi.post<IncidentApi>(url, data);

      if (response.status === 201 && files && files.length > 0) {
        await uploadFiles(files, 'incidents', 'x_driver_incidents', response.data.id);
      }

      return IncidentAdapter.driverIncidentToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al crear la incidencia',
        );
      }
      throw new Error('Error al crear la incidencia');
    }
  }

  public static async updateIncident({
    id,
    updatedItem,
  }: UpdatableItem<IncidentUpdate>) {
    const url = `/drivers/incidents/${id}`;
    const data = IncidentAdapter.driverIncidentUpdateToApi(updatedItem);
    try {
      const response = await odooApi.patch<IncidentApi>(url, data);
      return IncidentAdapter.driverIncidentToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al actualizar la incidencia',
        );
      }
      throw new Error('Error al actualizar la incidencia');
    }
  }
}

// async function uploadFiles(files: File[], incidenceId: number) {
//   try {
//     await FilesService.uploadFiles({
//       files,
//       route: 'incidents',
//       table: 'x_driver_incidents',
//       id: incidenceId,
//     });
//   } catch (error) {
//     console.error('Error uploading files:', error);
//   }
// }

