import type { Complaint, ComplaintAction, ComplaintCreate } from '../models';
import type { ComplaintActionApi, ComplaintApi } from '../models/api';
import { ComplaintActionsAdapter, ComplaintsAdapter } from '../adapters';

import { AxiosError } from 'axios';
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

  static async getComplaintActionsByComplaint(
    complaintId: number,
  ): Promise<ComplaintAction[]> {
    try {
      const response = await odooApi.get<ComplaintActionApi[]>(
        `/complaints/${complaintId}/actions`,
      );
      return response.data.map(ComplaintActionsAdapter.toComplaintAction);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al obtener las acciones de la queja',
        );
      }
      throw new Error('Error al obtener las acciones de la queja');
    }
  }
}

