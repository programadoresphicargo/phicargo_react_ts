import { Incidence, IncidenceCreate } from '../models';

import { AxiosError } from 'axios';
import { IncidenceAdapter } from '../adapters/incidence-adapter';
import odooApi from '@/api/odoo-api';

/**
 * Service to manage the incidences
 */
export class IncidenceServiceApi {
  /**
   * Method to get all the incidences
   * @returns List of incidences
   */
  public static async getAllInicences(): Promise<Incidence[]> {
    const url = `/drivers/incidents/all`;
    try {
      const response = await odooApi.get(url);
      return response.data.map(IncidenceAdapter.driverIncidenceToLocal);
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

  public static async getInicencesByDriver(
    driverId: number,
  ): Promise<Incidence[]> {
    const url = `/drivers/incidents/${driverId}`;
    try {
      const response = await odooApi.get(url);
      return response.data.map(IncidenceAdapter.driverIncidenceToLocal);
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
   * @returns Initial data of the incidence
   */
  public static async createIncidence({
    driverId,
    incidence,
  }: {
    driverId: number;
    incidence: IncidenceCreate;
  }): Promise<Incidence> {
    const url = `/drivers/${driverId}/incidents`;
    const data = IncidenceAdapter.driverIncidentToApi(incidence);
    try {
      const response = await odooApi.post(url, data);
      return IncidenceAdapter.driverIncidenceToLocal(response.data);
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

