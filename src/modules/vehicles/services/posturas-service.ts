import type { Postura, PosturaCreate } from '../models';

import { AxiosError } from 'axios';
import { PosturaAdapter } from '../adapters';
import type { PosturaApi } from '../models/api';
import odooApi from '@/api/odoo-api';

export class PosturasService {
  public static async getPosturasByVehicle(
    vehicleId: number,
  ): Promise<Postura[]> {
    try {
      const response = await odooApi.get<PosturaApi[]>(
        `/vehicles/postura/${vehicleId}`,
      );
      return response.data.map(PosturaAdapter.toPostura);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener las posturas',
        );
      }
      throw new Error('Error al obtener las posturas');
    }
  }

  public static async createPostura({
    vehicleId,
    data,
  }: {
    vehicleId: number;
    data: PosturaCreate;
  }): Promise<Postura> {
    const body = PosturaAdapter.toPosturaCreateApi(data);

    try {
      const response = await odooApi.post<PosturaApi>(
        `/vehicles/postura/${vehicleId}`,
        body,
      );
      return PosturaAdapter.toPostura(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al crear la postura',
        );
      }
      throw new Error('Error al crear la postura');
    }
  }

  public static async finishPostura(vehicleId: number): Promise<Postura> {
    try {
      const response = await odooApi.patch<PosturaApi>(
        `/vehicles/postura/${vehicleId}/finish`,
      );
      return PosturaAdapter.toPostura(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al finalizar la postura',
        );
      }
      throw new Error('Error al finalizar la postura');
    }
  }
}

