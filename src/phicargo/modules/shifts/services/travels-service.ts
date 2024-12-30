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
}

export default TravelServiceApi;

