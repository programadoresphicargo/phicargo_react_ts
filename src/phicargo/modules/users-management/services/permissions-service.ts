import {
  type PermissionUserApi,
  type Permission,
  type PermissionApi,
  type PermissionUser,
  PermissionUserAdd,
} from '../models';

import { AxiosError } from 'axios';
import odooApi from '../../core/api/odoo-api';
import {
  addPermissionsToApi,
  permissionToLocal,
  permissionUserToLocal,
} from '../adapters/permissions-mapper';

class PermissionsServiceApi {
  /**
   * Method to get all permissions
   * @returns Returns all permissions
   */
  static async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await odooApi.get<PermissionApi[]>(
        '/users-management/permissions',
      );
      return response.data.map(permissionToLocal);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener los permisos',
        );
      }
      throw new Error('Error al obtener los permisos');
    }
  }

  /**
   * Method to get the permissions of a user
   * @param userId User ID to get the permissions
   * @returns Array with the permissions of the user
   */
  static async getUserPermissions(userId: number): Promise<PermissionUser[]> {

    try {
      const response = await odooApi.get<PermissionUserApi[]>(
        `/users-management/permissions/${userId}`,
      );
      return response.data.map(permissionUserToLocal);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los permisos del usuario',
        );
      }
      throw new Error('Error al obtener los permisos del usuario');
    }
  }

  /**
   * Method to add permissions to a user
   * @param data Object with the user ID and the permissions to add
   */
  static async addPermissions(data: PermissionUserAdd) {
    const permissions = addPermissionsToApi(data);

    try {
      await odooApi.post<void>('/users-management/add/user/permissions', permissions);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al agregar los permisos',
        );
      }
      throw new Error('Error al agregar los permisos');
    }
  }
}

export default PermissionsServiceApi;

