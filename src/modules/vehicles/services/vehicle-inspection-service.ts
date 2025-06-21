import odooApi from '@/api/odoo-api';
import type { VehicleInspection, VehicleInspectionCreate } from '../models';
import type { InspectionApi, VehicleInspectionApi } from '../models/api';
import { VehicleInspectionAdapter } from '../adapters';
import { AxiosError } from 'axios';
import { uploadFiles } from '@/modules/core/services';

export class VehicleInspectionService {
  static async getVehicleInspections(
    month: number,
    year: number,
  ): Promise<VehicleInspection[]> {
    try {
      const response = await odooApi.get<VehicleInspectionApi[]>(
        '/vehicles/inspections/',
        {
          params: {
            month,
            year,
          },
        },
      );
      return response.data.map(VehicleInspectionAdapter.toVehicleInspection);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
      }
      throw new Error('An error occurred');
    }
  }

  static async createVehicleInspection({
    files,
    data,
  }: {
    data: VehicleInspectionCreate;
    files?: File[];
  }) {
    const body = VehicleInspectionAdapter.toVehicleInspectionApi(data);
    const url = `/vehicles/inspections/${data.vehicleId}`;
    try {
      const response = await odooApi.post<InspectionApi>(url, body);

      if (
        response.status === 201 &&
        files &&
        files.length > 0 &&
        response.data.incident_id
      ) {
        await uploadFiles(
          files,
          'incidents',
          'x_driver_incidents',
          response.data.incident_id,
        );
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al crear la inspección',
        );
      }
      throw new Error('Error al crear la inspección');
    }
  }
}

