import type { Maneuver, ManeuverApi } from '../models';

import dayjs from 'dayjs';

/**
 * Mapper from Maneuver to ManeuverApi
 * @param maneuver Object to be converted
 * @returns Object converted to ManeuverApi
 */
export const maneuverToLocal = (maneuver: ManeuverApi): Maneuver => ({
  id: maneuver.id_maniobra,
  type: maneuver.tipo_maniobra,
  programmedStart: dayjs(maneuver.inicio_programado),
  status: maneuver.estado_maniobra,

  terminal: {
    id: maneuver.terminal.id_terminal,
    name: maneuver.terminal.terminal,
  },
  vehicle: {
    id: maneuver.vehicle.id,
    name: maneuver.vehicle.name2,
  },
});

