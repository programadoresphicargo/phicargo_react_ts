export interface ManeuverSimple {
  id: number;
  type: string;
  status: 'activa' | 'cancelada' | 'borrador' | 'finalizada';
}

export interface ManeuverSimpleApi {
  id_maniobra: number;
  tipo_maniobra: string;
  estado_maniobra: 'activa' | 'cancelada' | 'borrador' | 'finalizada';
}
