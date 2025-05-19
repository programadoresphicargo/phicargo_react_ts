import type { BranchSimple, CompanySimple } from '@/modules/core/models';
import type { TravelState, WaybillStatus } from '../service-model';

export interface CategoryApi {
  id: number;
  name: string;
}

export interface ClientApi {
  id: number;
  name: string;
  street: string;
}

export interface TravelApi {
  id: number;
  name: string;
  x_status_viaje: string;
  driver: string | null;
  vehicle: string | null;
  state: TravelState;
}

export interface ManeuverApi {
  id_maniobra: number;
  tipo_maniobra: string;
  estado_maniobra: string;
  inicio_programado: string;
  fecha_activacion: string | null;
  driver: string | null;
  vehicle: string | null;
}

export interface WaybillServiceApi {
  id: number;
  name: string | null;
  date_order: string;
  state: WaybillStatus;
  cfdi_complemento: string;
  branch: BranchSimple | null;
  company: CompanySimple;
  category: CategoryApi | null;
  client: ClientApi;
  x_reference: string | null;
  x_subcliente_bel: string | null;
  x_ruta_bel: string | null;
  x_tipo_bel: string | null;
  x_modo_bel: string | null;
  x_medida_bel: string | null;
  x_clase_bel: string | null;
  x_custodia_bel: string | null;
  x_tipo2_bel: string | null;
  x_reference_owr: string | null;
  x_reference_2: string | null;
  x_ejecutivo: string | null;
  travel: TravelApi | null;
  maneuvers: ManeuverApi[];
}
