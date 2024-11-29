import type {
  BranchSimple,
  CompanySimple,
  ManeuverSimpleApi,
  TravelSimpleApi,
} from '../../../core/models';
import type {
  VehicleBrand,
  VehicleCategory,
  VehicleState,
} from '../vehicle-model';

import type { DriverSimpleApi } from './driver-model-api';
import type { MaintenanceRecordSimpleApi } from '../../../maintenance/models';
import { Modality } from '../driver-model';

export interface VehicleBaseApi {
  id: number;
  name2: string;
  license_plate: string | null;
  serial_number: string | null;
  fleet_type: string | null;
  x_status: string;
  x_tipo_vehiculo: string | null;
  x_modalidad: Modality | null;
  x_tipo_carga: string | null;

  state: VehicleState;
  category: VehicleCategory | null;
  brand: VehicleBrand | null;
  res_store: BranchSimple | null;
  res_company: CompanySimple | null;
}

export interface VehicleApi extends VehicleBaseApi {
  tms_travel: TravelSimpleApi | null;
  maniobra: ManeuverSimpleApi | null;
  maintenance_records: MaintenanceRecordSimpleApi[];
  driver: DriverSimpleApi | null;
}

export interface VehicleSimpleApi {
  readonly id: number;
  readonly name2: string;
  fleet_type: string | null;
  x_status: string;
  x_modalidad: string | null;
  x_tipo_carga: string | null;
}


export interface VehicleUpdateApi {
  company_id?: number | null;
  x_sucursal?: number | null;
  state_id?: number | null;
  x_operador_asignado?: number | null;
  fleet_type?: string | null;
  x_modalidad?: Modality | null;
  x_tipo_carga?: string | null;
}
