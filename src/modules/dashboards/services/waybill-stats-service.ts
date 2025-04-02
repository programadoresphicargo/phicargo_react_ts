import type {
  MonthlyRevenueByClient,
  MontlyContainersByClient,
  WaybillStats,
  YearlyContainersByClient,
  YearlyRevenueByClient,
} from '../models/waybill-stats-model';
import type {
  MonthlyRevenueByClientApi,
  MontlyContainersByClientApi,
  WaybillStatsApi,
  YearlyContainersByClientApi,
  YearlyRevenueByClientApi,
} from '../models/api/waybill-stats-model-api';

import { AxiosError } from 'axios';
import { WaybillStatsAdapter } from '../adapters/waybill-stats-adapter';
import odooApi from '@/api/odoo-api';

export class WaybillStatsService {
  public static async getWaybillStats(
    startDate: string,
    endDate: string,
    companyId: number | null,
    branchId: number | null,
  ): Promise<WaybillStats> {
    let url = `/tms_waybill/stats?start_date=${startDate}&end_date=${endDate}`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }
    try {
      const response = await odooApi.get<WaybillStatsApi>(url);
      return WaybillStatsAdapter.toWaybilStats(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las estadísticas de guías de carga',
        );
      }
      throw new Error('Error al obtener las estadísticas de guías de carga');
    }
  }

  public static async getMonthlyRevenueByClient(
    startDate: string,
    endDate: string,
    companyId: number | null,
    branchId: number | null,
  ): Promise<MonthlyRevenueByClient[]> {
    let url = `/tms_waybill/stats/monthly-revenue-by-client?start_date=${startDate}&end_date=${endDate}`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }
    try {
      const response = await odooApi.get<MonthlyRevenueByClientApi[]>(url);
      return response.data.map(WaybillStatsAdapter.toMonthlyRevenueByClient);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los ingresos mensuales por cliente',
        );
      }
      throw new Error('Error al obtener los ingresos mensuales por cliente');
    }
  }

  public static async getMonthlyContainersByClient(
    startDate: string,
    endDate: string,
    companyId: number | null,
    branchId: number | null,
  ): Promise<MontlyContainersByClient[]> {
    let url = `/tms_waybill/stats/monthly-containers-by-client?start_date=${startDate}&end_date=${endDate}`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }
    try {
      const response = await odooApi.get<MontlyContainersByClientApi[]>(url);
      return response.data.map(WaybillStatsAdapter.toMonthlyContainersByClient);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los contenedores mensuales por cliente',
        );
      }
      throw new Error(
        'Error al obtener los contenedores mensuales por cliente',
      );
    }
  }

  public static async getYearlyRevenueByClient(
    companyId: number | null,
    branchId: number | null,
  ): Promise<YearlyRevenueByClient[]> {
    let url = `/tms_waybill/stats/yearly-revenue-by-client?`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }
    try {
      const response = await odooApi.get<YearlyRevenueByClientApi[]>(url);
      return response.data.map(WaybillStatsAdapter.toYearlyRevenueByClient);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los ingresos anuales por cliente',
        );
      }
      throw new Error('Error al obtener los ingresos anuales por cliente');
    }
  }

  public static async getYearlyContainersByClient(
    companyId: number | null,
    branchId: number | null,
  ): Promise<YearlyContainersByClient[]> {
    let url = `/tms_waybill/stats/yearly-containers-by-client?`;

    if (companyId) {
      url = url.concat(`&company_id=${companyId}`);
    }

    if (branchId) {
      url = url.concat(`&branch_id=${branchId}`);
    }
    try {
      const response = await odooApi.get<YearlyContainersByClientApi[]>(url);
      return response.data.map(WaybillStatsAdapter.toYearlyContainersByClient);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los contenedores anuales por cliente',
        );
      }
      throw new Error('Error al obtener los contenedores anuales por cliente');
    }
  }
}

