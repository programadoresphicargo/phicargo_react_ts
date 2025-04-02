import { AxiosError } from 'axios';
import type { Contact } from '../models';
import odooApi from '@/api/odoo-api';

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
          error.response?.data.detail || 'Error al obtener clientes',
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
          error.response?.data.detail || 'Error al obtener proveedores',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to search contacts by name
   * @param name Name of the contact to search
   * @returns Array of contacts that match the name
   */
  public static async searhContactByName(name: string): Promise<Contact[]> {
    try {
      const response = await odooApi.get<Contact[]>(`/contacts/search-by-name/${name}`);
      return response.data;
    } catch(error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al buscar contacto',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default ContactsServiceApi;

