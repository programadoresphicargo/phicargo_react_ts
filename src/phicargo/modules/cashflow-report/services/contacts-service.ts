import { AxiosError } from 'axios';
import type { Contact } from '../models';
import odooApi from '../../core/api/odoo-api';

/**
 * API service for contacts
 */
class ContactsServiceApi {
  /**
   * Method to get all clients
   * @returns Array of contacts who are clients
   */
  public static async getAllClients(): Promise<Contact[]> {
    try {
      const response = await odooApi.get<Contact[]>('/contacts/clients');
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al obtener clientes',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to get all providers
   * @returns Array of contacts who are providers
   */
  public static async getAllProviders(): Promise<Contact[]> {
    try {
      const response = await odooApi.get<Contact[]>('/contacts/providers');
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.details || 'Error al obtener proveedores',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default ContactsServiceApi;

