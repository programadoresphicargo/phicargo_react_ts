import type { Session, SessionApi, UserLogin } from '../models';

import { AxiosError } from 'axios';
import odooApi from '../../core/api/odoo-api';
import { sessionToLocal } from '../adapters';

/**
 * Class with methods to interact with the authentication API
 */
class AuthServiceApi {
  /**
   * Method to login
   * @param credentials Object with username and password properties
   * @returns Returns a promise with the session object
   */
  static async login(credentials: UserLogin): Promise<Session> {
    try {
      const response = await odooApi.post<SessionApi>(
        '/users/login',
        credentials,
      );
      return sessionToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al iniciar sesión',
        );
      }
      throw new Error('Error al iniciar sesión');
    }
  }

  /**
   * Method to refresh the token
   * @returns Returns a promise with the session object
   */
  static async refreshToken(): Promise<Session> {
    try {
      const response = await odooApi.post<SessionApi>('/users/refresh');
      return sessionToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al refrescar sesión',
        );
      }
      throw new Error('Error al refrescar sesión');
    }
  }
}

export default AuthServiceApi;

