import { Incident, IncidentCreate } from '../models';

import { AxiosError } from 'axios';
import odooApi from '@/api/odoo-api';
import { IncidentAdapter } from '../adapters';
import { IncidentApi } from '../models/api';

/**
 * Service to manage the incidents
 */
export class IncidentsService {
  /**
   * Method to get all the incidents
   * @returns List of incidents
   */
  public static async getAllIncidents(): Promise<Incident[]> {
    const url = `/drivers/incidents/all`;
    try {
      const response = await odooApi.get<IncidentApi[]>(url);
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

  public static async getIncidentsByDriver(
    driverId: number,
  ): Promise<Incident[]> {
    const url = `/drivers/incidents/${driverId}`;
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

  /**
   * Method to create a new incidence
   * @param param0 Object with the data to create a new incidence
   * @returns Initial data of the incident
   */
  public static async createIncident({
    driverId,
    incident,
  }: {
    driverId: number;
    incident: IncidentCreate;
  }): Promise<Incident> {
    const url = `/drivers/${driverId}/incidents`;
    const data = IncidentAdapter.driverIncidentToApi(incident);
    try {
      const response = await odooApi.post<IncidentApi>(url, data);
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
}

