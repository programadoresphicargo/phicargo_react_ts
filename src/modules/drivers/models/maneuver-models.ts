import { Dayjs } from 'dayjs';

export interface Maneuver {
  id: number;
  type: string;
  programmedStart: Dayjs;
  status: 'activa' | 'cancelada' | 'borrador' | 'finalizada';

  terminal: ManeuverTerminal;
  vehicle: VehicleInfo;
}

export interface ManeuverTerminal {
  id: number;
  name: string;
}

export interface ManeuverTerminalApi {
  id_terminal: number;
  terminal: string;
}

export interface VehicleInfo {
  id: number;
  name: string;
}

