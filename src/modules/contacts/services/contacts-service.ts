import { AxiosError } from 'axios';
import type { Contact } from '../models';
import type { ContactApi } from '../models/api';
import { ContactsAdapter } from '../adapters';
import odooApi from '@/api/odoo-api';

export class ContactsService {
  public static async getContacts(name: string): Promise<Contact[]> {
    const url = `/contacts/search-by-name/${name}`;

    try {
      const response = await odooApi.get<ContactApi[]>(url);
      return response.data.map(ContactsAdapter.toContact);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener los contactos',
        );
      }
      throw new Error('Error al obtener los contactos');
    }
  }
}

