import type { Workshop, WorkshopApi, WorkshopCreate } from '../models';

import { AxiosError } from 'axios';
import odooApi from '../../core/api/odoo-api';
import { workshopToLocal } from '../adapters/mappers/workshop-mapper';

/**
 * Workshop Service API
 */
class WorkshopServiceApi {
  /**
   * Method to get all workshops
   * @returns Array of workshops
   */
  public static async getWorkshops(): Promise<Workshop[]> {
    try {
      const response = await odooApi.get<WorkshopApi[]>(
        '/maintenance-record/workshops/all',
      );
      return response.data.map(workshopToLocal);
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
   * Method to add a workshop
   * @param workshop Workshop to add
   * @returns Message from the server
   */
  public static async addWorkshop(workshop: WorkshopCreate): Promise<Workshop> {
    try {
      const response = await odooApi.post<WorkshopApi>(
        '/maintenance-record/workshops/add',
        workshop,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.detail || 'Error al crear taller');
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default WorkshopServiceApi;
