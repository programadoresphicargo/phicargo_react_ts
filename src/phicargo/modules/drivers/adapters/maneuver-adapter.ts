import { Maneuver } from '../models';
import { ManeuverApi } from '../models/api';
import dayjs from 'dayjs';

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
