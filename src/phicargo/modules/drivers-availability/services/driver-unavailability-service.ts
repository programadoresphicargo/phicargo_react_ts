import type {
  DriverUnavailabilityCreate,
  DriverUnavailable,
} from '../models/driver-unavailability';
import {
  driverUnavailabilityToApi,
  driverUnavailabilityToLocal,
} from '../adapters/drivers/driver-unavailability-mapper';

import { AxiosError } from 'axios';
import type { DriverUnavailableApi } from '../models/api/driver-unavailability-api';
import odooApi from '../../core/api/odoo-api';

class DriverUnavailabilityServiceApi {
  static async getDriverUnavailabilitiesById(
    driverId: number,
  ): Promise<DriverUnavailable[]> {
    try {
      const response = await odooApi.get<DriverUnavailableApi[]>(
        `/drivers/unavailability/${driverId}`,
      );
      return response.data.map(driverUnavailabilityToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            'Error getting driver unavailabilities',
        );
      }
      throw new Error('Error getting driver unavailabilities');
    }
  }

  static async createDriverUnavailability(newItem: DriverUnavailabilityCreate) {
    const data = driverUnavailabilityToApi(newItem);

    try {
      await odooApi.post('/drivers/unavailability', data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            'Error creating driver unavailability',
        );
      }
      throw new Error('Error creating driver unavailability');
    }
  }
}

export default DriverUnavailabilityServiceApi;
