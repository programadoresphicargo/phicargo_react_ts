import type {
  VehicleRevenueProjection,
  VehicleRevenueProjectionByBranch,
} from '../models';
import type {
  VehicleRevenueProjectionApi,
  VehicleRevenueProjectionByBranchApi,
} from '../models/api';

import { AxiosError } from 'axios';
import { VehicleRevenueProjectionAdapter } from '../adapters';
import odooApi from '../../core/api/odoo-api';

export class VehicleRevenueProjectionService {
  public static async getProjection(
    startDate: string,
    endDate: string,
  ): Promise<VehicleRevenueProjection[]> {
    const url = `/vehicles/revenue-projection/?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<VehicleRevenueProjectionApi[]>(url);

      return response.data.map(
        VehicleRevenueProjectionAdapter.toVehicleRevenueProjection,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener la proyección de ingresos de vehículos',
        );
      }
      throw new Error(
        'Error al obtener la proyección de ingresos de vehículos',
      );
    }
  }
  public static async getProjectionByBranch(
    startDate: string,
    endDate: string,
  ): Promise<VehicleRevenueProjectionByBranch[]> {
    const url = `/vehicles/revenue-projection-by-branch/?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await odooApi.get<VehicleRevenueProjectionByBranchApi[]>(
        url,
      );

      return response.data.map(
        VehicleRevenueProjectionAdapter.toVehicleRevenueProjectionByBranch,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener la proyección de ingresos de vehículos por sucursal',
        );
      }
      throw new Error(
        'Error al obtener la proyección de ingresos de vehículos por sucursal',
      );
    }
  }
  public static async getProjectionSnapshot(
    snapshotDate: string,
  ): Promise<VehicleRevenueProjection[]> {
    const url = `/vehicles/revenue-projection/snapshot?snapshot_date=${snapshotDate}`;

    try {
      const response = await odooApi.get<VehicleRevenueProjectionApi[]>(url);
      return response.data.map(
        VehicleRevenueProjectionAdapter.toVehicleRevenueProjection,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener la proyección de ingresos de vehículos',
        );
      }
      throw new Error(
        'Error al obtener la proyección de ingresos de vehículos',
      );
    }
  }
}

