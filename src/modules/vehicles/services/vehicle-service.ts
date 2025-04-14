import type {
  MotumEvent,
  Vehicle,
  VehicleStatusChangeEvent,
  VehicleUpdate,
} from '../models';
import type {
  MotumEventAPI,
  VehicleApi,
  VehicleStatusChangeEventApi,
} from '../models/api';

import { AxiosError } from 'axios';
import type { UpdatableItem } from '@/types';
import { VehicleAdapter } from '../adapters/vehicle-adapter';
import odooApi from '@/api/odoo-api';

export class VehicleServiceApi {
  static async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await odooApi.get<VehicleApi[]>('/vehicles/');
      return response.data.map(VehicleAdapter.vehicleToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async updateVehicle({
    id,
    updatedItem,
  }: UpdatableItem<VehicleUpdate>): Promise<Vehicle> {
    const data = VehicleAdapter.vehicleUpdateToApi(updatedItem);
    console.log(data);
    try {
      const response = await odooApi.patch<VehicleApi>(`/vehicles/${id}`, data);
      return VehicleAdapter.vehicleToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async getStatusChangeHistoryByVehicle(
    vehicleId: number,
  ): Promise<VehicleStatusChangeEvent[]> {
    try {
      const response = await odooApi.get<VehicleStatusChangeEventApi[]>(
        `/vehicles/status-changes-history/${vehicleId}`,
      );
      return response.data.map(VehicleAdapter.toVehicleStatusChangeEvent);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async getMotumEvents(
    status: string = 'pending',
  ): Promise<MotumEvent[]> {
    try {
      const response = await odooApi.get<MotumEventAPI[]>(
        `/vehicles/alerts-motum/?status=${status}`,
      );
      return response.data.map(VehicleAdapter.toMotumEvent);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async attendMotumEvent({ id, updatedItem }: UpdatableItem<{comment: string}>): Promise<MotumEvent> {
    try {
      const response = await odooApi.patch<MotumEventAPI>(
        `/vehicles/alerts-motum/${id}/attend`,
        updatedItem,
      );
      return VehicleAdapter.toMotumEvent(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }
}

