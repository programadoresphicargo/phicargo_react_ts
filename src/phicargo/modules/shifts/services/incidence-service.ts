import type {
  Incidence,
  IncidenceCreate,
} from '../models/driver-incidence-model';
import {
  driverIncidenceToLocal,
  driverIncidentToApi,
} from '../adapters/driver-incident-adapter';

import { AxiosError } from 'axios';
import odooApi from '../../core/api/odoo-api';

/**
 * Service to manage the incidences
 */
class IncidenceServiceApi {
  /**
   * Method to get all the incidences
   * @returns List of incidences
   */
  public static async getAllInicences(): Promise<Incidence[]> {
    const url = `/drivers/incidents/all`;
    try {
      const response = await odooApi.get(url);
      return response.data.map(driverIncidenceToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener las incidencias',
        );
      }
      throw new Error('Error al obtener las incidencias');
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
    const data = driverIncidentToApi(incidence);
    try {
      const response = await odooApi.post(url, data);
      return driverIncidenceToLocal(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al crear la incidencia',
        );
      }
      throw new Error('Error al crear la incidencia');
    }
  }
}

export default IncidenceServiceApi;

