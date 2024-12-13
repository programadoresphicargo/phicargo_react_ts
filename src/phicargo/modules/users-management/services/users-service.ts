import type { FullUser, FullUserApi, User, UserApi } from '../../auth/models';
import { UserCreate, UserUpdate } from '../models';
import { fullUserToLocal, userToLocal } from '../../auth/adapters';
import { userToApi, userUpdateToApi } from '../adapters/users-mapper';

import { AxiosError } from 'axios';
import { UpdatableItem } from '../../core/types/global-types';
import odooApi from '../../core/api/odoo-api';

/**
 * UsersServiceApi class.
 */
class UsersServiceApi {
  /**
   * Method to get the information of a user.
   * @param userId ID of the user.
   * @returns Object with the user information.
   */
  static async getUserInfo(userId: number): Promise<FullUser> {
    try {
      const response = await odooApi.get<FullUserApi>(
        `/users-management/info/${userId}`,
      );
      return fullUserToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al obtener la información del usuario',
        );
      }
      throw new Error('Error al obtener la información del usuario');
    }
  }

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
          error.response?.data.detail || 'Error al obtener los usuarios',
        );
      }
      throw new Error('Error al obtener los usuarios');
    }
  }

  /**
   * Method to create a user.
   * @param user User data to create
   * @returns User created
   */
  static async createUser(user: UserCreate): Promise<User> {

    const userData = userToApi(user);

    try {
      const response = await odooApi.post<UserApi>('/users-management/users', userData);
      return userToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al crear el usuario',
        );
      }
      throw new Error('Error al crear el usuario');
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
  }: UpdatableItem<UserUpdate>): Promise<User> {
    const data = userUpdateToApi(updatedItem);
    console.log(data);
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

