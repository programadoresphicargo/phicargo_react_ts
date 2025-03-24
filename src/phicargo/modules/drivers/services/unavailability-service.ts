import type {
  DriverUnavailabilityCreate,
  DriverUnavailable,
  DriverVacationSummary,
} from '../models';
import type {
  DriverUnavailableApi,
  DriverVacationSummaryApi,
} from '../models/api';

import { AxiosError } from 'axios';
import { UnavailabilityAdapter } from '../adapters/unavailability-adapter';
import odooApi from '../../core/api/odoo-api';

/**
 * Service class to manage driver unavailabilities
 */
export class DriverUnavailabilityServiceApi {
  /**
   * Method to get driver unavailabilities by driver ID
   * @param driverId ID of the driver
   * @returns Array of driver unavailabilities
   */
  static async getDriverUnavailabilitiesById(
    driverId: number,
  ): Promise<DriverUnavailable[]> {
    try {
      const response = await odooApi.get<DriverUnavailableApi[]>(
        `/drivers/unavailability/${driverId}`,
      );
      return response.data.map(
        UnavailabilityAdapter.driverUnavailabilityToLocal,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error getting driver unavailabilities',
        );
      }
      throw new Error('Error getting driver unavailabilities');
    }
  }

  /**
   * Method to create a new driver unavailability
   * @param newItem Object with the data to create a new driver unavailability
   */
  static async createDriverUnavailability(
    newItem: DriverUnavailabilityCreate,
  ): Promise<DriverUnavailable> {
    const data = UnavailabilityAdapter.driverUnavailabilityToApi(newItem);

    try {
      const response = await odooApi.post<DriverUnavailableApi>(
        '/drivers/unavailability',
        data,
      );
      return UnavailabilityAdapter.driverUnavailabilityToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error creating driver unavailability',
        );
      }
      throw new Error('Error creating driver unavailability');
    }
  }

  static async releaseDriverUnavailability(
    id: number,
  ): Promise<DriverUnavailable> {
    try {
      const response = await odooApi.patch(
        `/drivers/unavailability/release/${id}`,
      );
      return UnavailabilityAdapter.driverUnavailabilityToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error releasing driver unavailability',
        );
      }
      throw new Error('Error releasing driver unavailability');
    }
  }

  public static async getDriverVacationSummary(
    id: number,
  ): Promise<DriverVacationSummary> {
    try {
      const response = await odooApi.get<DriverVacationSummaryApi>(
        `/drivers/vacation-summary/${id}`,
      );
      return UnavailabilityAdapter.driverVacationSummaryToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error getting driver vacation summary',
        );
      }
      throw new Error('Error getting driver vacation summary');
    }
  }
}
