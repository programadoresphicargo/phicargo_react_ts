import { AxiosError } from 'axios';
import type { Travel } from '../models/travels-models';
import type { TravelApi } from '../models/api/travel-models-models-api';
import odooApi from '../../core/api/odoo-api';
import { travelToLocal } from '../adapters/travel-adapter';

/**
 * TravelServiceApi class.
 */
class TravelServiceApi {
  /**
   * Get travels near to branch.
   * @param branchId Branch id.
   * @returns Travels near to branch.
   */
  public static async getTravelsNearToBranch(
    branchId: number,
  ): Promise<Travel[]> {
    try {
      const response = await odooApi.get<TravelApi[]>(
        `/tms_travel/near_to_branch/${branchId}`,
      );
      return response.data.map(travelToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los viajes cercanos a la sucursal',
        );
      }
      throw new Error('Error al obtener los viajes cercanos a la sucursal');
    }
  }

  /**
   * MEthod to get travels in unloading.
   * @param branchId ID of the branch
   * @returns Array of travels in unloading
   */
  public static async getUnloadingTravels(branchId: number): Promise<Travel[]> {
    try {
      const response = await odooApi.get<TravelApi[]>(
        `/tms_travel/unloading/${branchId}`,
      );
      return response.data.map(travelToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los viajes en descarga',
        );
      }
      throw new Error('Error al obtener los viajes en descarga');
    }
  }

  /**
   * Method to get travels in plant.
   * @param branchId ID of the branch
   * @returns Array of travels in plant
   */
  public static async getTravelsInPlant(branchId: number): Promise<Travel[]> {
    const url = `/tms_travel/by-status/planta?branch_id=${branchId}`;

    try {
      const response = await odooApi.get<TravelApi[]>(url);
      return response.data.map(travelToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los viajes en planta',
        );
      }
      throw new Error('Error al obtener los viajes en planta');
    }
  }
}

export default TravelServiceApi;

