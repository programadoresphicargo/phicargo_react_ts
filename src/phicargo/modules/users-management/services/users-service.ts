import type { User, UserApi } from '../../auth/models';

import { AxiosError } from 'axios';
import { UpdatebleItem } from '../../core/types/global-types';
import { UserUpdate } from '../models';
import odooApi from '../../core/api/odoo-api';
import { userToLocal } from '../../auth/adapters';
import { userUpdateToApi } from '../adapters/users-mapper';

/**
 * UsersServiceApi class.
 */
class UsersServiceApi {
  /**
   * Get all users.
   * @returns Promise<User[]>.
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await odooApi.get<UserApi[]>('/users-management/');
      return response.data.map(userToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.message || 'Error al obtener los usuarios',
        );
      }
      throw new Error('Error al obtener los usuarios');
    }
  }

  /**
   * Method to get a user by id.
   * @param param0 Obect with the id and the updated item
   * @returns Object with the updated user
   */
  static async updateUser({
    id,
    updatedItem,
  }: UpdatebleItem<UserUpdate>): Promise<User> {
    const data = userUpdateToApi(updatedItem);

    try {
      const response = await odooApi.patch<UserApi>(
        `/users-management/users/${id}`,
        data,
      );
      return userToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al actualizar el usuario',
        );
      }
      throw new Error('Error al actualizar el usuario');
    }
  }
}

export default UsersServiceApi;

