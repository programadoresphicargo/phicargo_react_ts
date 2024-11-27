import type {
  Vehicle,
  VehicleRead,
  VehicleWithDriver,
  VehicleWithTravelRef,
} from '../models/vehicle-model';
import type {
  VehicleApi,
  VehicleReadApi,
  VehicleWithDriverApi,
  VehicleWithTravelRefApi,
} from '../models/api/vehicle-model-api';
import {
  vehicleReadToLocal,
  vehicleToLocal,
  vehicleWithDriverToLocal,
  vehicleWithTravelRefToLocal,
} from '../adapters/vehicles/vehicle-mapper';

import { AxiosError } from 'axios';
import odooApi from '../../core/api/odoo-api';

class VehicleServiceApi {
  static async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await odooApi.get<VehicleApi[]>('/vehicles/');
      return response.data.map(vehicleToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async getVehiclesWithTravelRef(): Promise<VehicleWithTravelRef[]> {
    try {
      const response = await odooApi.get<VehicleWithTravelRefApi[]>(
        '/vehicles/with_travel_reference',
      );
      return response.data.map(vehicleWithTravelRefToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async getVehiclesRead(): Promise<VehicleRead[]> {
    try {
      const response = await odooApi.get<VehicleReadApi[]>(
        '/vehicles/available',
      );
      return response.data.map(vehicleReadToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async getVehiclesWithDriver(): Promise<VehicleWithDriver[]> {
    try {
      const response = await odooApi.get<VehicleWithDriverApi[]>(
        `/vehicles/with_driver`,
      );
      return response.data.map(vehicleWithDriverToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }
}

export default VehicleServiceApi;

