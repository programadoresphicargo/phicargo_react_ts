import type { UnitIndicators } from '../models/unit-indicators-model';
import type { UnitIndicatorsApi } from '../models/api/unit-indicators-model';

/**
 * Adaptador para convertir los indicadores de unidades de la API a los indicadores de unidades local
 * @param indicators Objeto con los indicadores de unidades de la API
 * @returns Objeto con los indicadores de unidades local
 */
export const unitIndicatorsToLocal = (
  indicators: UnitIndicatorsApi,
): UnitIndicators => ({
  totalUnits: indicators.total_units,
  unitsInMaintenance: indicators.units_in_maintenance,
  unitsNoOperator: indicators.units_no_operator,
});
