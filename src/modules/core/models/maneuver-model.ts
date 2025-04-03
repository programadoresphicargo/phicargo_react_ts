import { Dayjs } from 'dayjs';

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

export interface VehicleInfoApi {
  id: number;
  name2: string;
}

export interface ManeuverSimple {
  id: number;
  type: string;
  status: 'activa' | 'cancelada' | 'borrador' | 'finalizada';
  finishedDate: Dayjs | null;
}

export interface ManeuverSimpleApi {
  id_maniobra: number;
  tipo_maniobra: string;
  estado_maniobra: 'activa' | 'cancelada' | 'borrador' | 'finalizada';
  fecha_finalizada: string | null;
}

export interface Maneuver {
  id: number;
  type: string;
  programmedStart: Dayjs;
  status: 'activa' | 'cancelada' | 'borrador' | 'finalizada';

  terminal: ManeuverTerminal;
  vehicle: VehicleInfo;
}

export interface ManeuverApi {
  id_maniobra: number;
  tipo_maniobra: string;
  inicio_programado: string;
  estado_maniobra: 'activa' | 'cancelada' | 'borrador' | 'finalizada';

  terminal: ManeuverTerminalApi;
  vehicle: VehicleInfoApi;
}
