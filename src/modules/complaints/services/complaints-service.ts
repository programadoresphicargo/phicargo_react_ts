import type { Complaint, ComplaintCreate } from '../models';

import { AxiosError } from 'axios';
import type { ComplaintApi } from '../models/api';
import { ComplaintsAdapter } from '../adapters';
import odooApi from '@/api/odoo-api';

export class ComplaintsService {
  static async getComplaints(): Promise<Complaint[]> {
    try {
      const response = await odooApi.get<ComplaintApi[]>('/complaints');
      return response.data.map(ComplaintsAdapter.toComplaint);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener las quejas',
        );
      }
      throw new Error('Error al obtener las quejas');
    }
  }

  static async createComplaint(complaint: ComplaintCreate): Promise<Complaint> {
    const body = ComplaintsAdapter.toComplaintCreateApi(complaint);
    try {
      const response = await odooApi.post<ComplaintApi>('/complaints', body);
      return ComplaintsAdapter.toComplaint(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al crear la queja',
        );
      }
      throw new Error('Error al crear la queja');
    }
  }
}

