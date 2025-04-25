import { AxiosError } from 'axios';
import type { UnitIndicators } from '../models/unit-indicators-model';
import type { UnitIndicatorsApi } from '../models/api/unit-indicators-model';
import odooApi from '@/api/odoo-api';
import { unitIndicatorsToLocal } from '../adapters/units-adapters';

export interface IUnitsService {
  /**
   * Obtiene los indicadores de unidades
   * @returns Objeto con los indicadores de unidades
   */
  getIndicators: (branchId: number) => Promise<UnitIndicators>;
}

class UnitsService implements IUnitsService {
  public async getIndicators(branchId: number): Promise<UnitIndicators> {
    const url = `/get_unit_indicators.php?branch_id=${branchId}`;

    try {
      const response = await odooApi.get<UnitIndicatorsApi>(url);
      return unitIndicatorsToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail ||
            'Error al obtener los indicadores de unidades',
        );
      }
      throw new Error('Error al obtener los indicadores de unidades');
    }
  }
}

export default UnitsService;
