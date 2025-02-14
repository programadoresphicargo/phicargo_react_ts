import { AxiosError } from 'axios';
import type { WaybillStats } from '../models/waybill-stats-model';
import { WaybillStatsAdapter } from '../adapters/waybill-stats-adapter';
import type { WaybillStatsApi } from '../models/api/waybill-stats-model-api';
import odooApi from '../../core/api/odoo-api';

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
}

