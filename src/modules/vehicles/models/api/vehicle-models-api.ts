import type {
  BranchSimple,
  CompanySimple,
  ManeuverSimpleApi,
  TravelSimpleApi,
} from '../../../core/models';
import {
  DriverPosturaSimpleApi,
  DriverSimpleApi,
} from '@/modules/drivers/models/api';
import { VehicleBrand, VehicleCategory, VehicleState } from '../vehicle-models';

import type { MaintenanceRecordSimpleApi } from '../../../maintenance/models';
import type { Modality } from '@/modules/drivers/models';

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

  state: VehicleState | null;
  category: VehicleCategory | null;
  brand: VehicleBrand | null;
  res_store: BranchSimple | null;
  res_company: CompanySimple | null;
}

export interface VehicleApi extends VehicleBaseApi {
  tms_travel: TravelSimpleApi | null;
  maniobra: ManeuverSimpleApi | null;
  maintenance_records: MaintenanceRecordSimpleApi | null;
  driver: DriverSimpleApi | null;
  driver_postura: DriverPosturaSimpleApi | null;
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
  x_tipo_vehiculo?: string | null;
  x_modalidad?: Modality | null;
  x_tipo_carga?: string | null;
}

export interface VehicleStatusChangeEventApi {
  id: number;
  vehicle_id: number;
  status: string;
  previous_status: string | null;
  start_date: string;
  end_date: string | null;
  delivery_date: string | null;
}

export interface MotumEventAPI {
  id: number;
  event_type: number;
  event: string;
  event_type_name: string;
  event_description: string;
  vehicle_name: string;
  created_at: string;
  status: string;
  latitude: number;
  longitude: number;
}

