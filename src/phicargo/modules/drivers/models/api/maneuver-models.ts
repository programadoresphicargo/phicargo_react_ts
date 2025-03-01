export interface ManeuverApi {
  id_maniobra: number;
  tipo_maniobra: string;
  inicio_programado: string;
  estado_maniobra: 'activa' | 'cancelada' | 'borrador' | 'finalizada';

  terminal: ManeuverTerminalApi;
  vehicle: VehicleInfoApi;
}

export interface ManeuverTerminalApi {
  id_terminal: number;
  terminal: string;
}

export interface VehicleInfoApi {
  id: number;
  name2: string;
}

