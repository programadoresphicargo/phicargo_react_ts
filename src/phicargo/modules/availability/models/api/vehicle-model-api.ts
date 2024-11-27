import { ManeuverSimpleApi, TravelSimpleApi } from "../../../core/models";

import { DriverSimpleApi } from "./driver-model-api";
import { MaintenanceRecordSimpleApi } from "../../../maintenance/models";
import { SimpleData } from "../../../core/types/global-types";

export interface VehicleWithTravelRefApi {
  id: number;
  name: string;
  serial_number: string | null;
  licence_plate: string | null;
  fleet_type: string | null;
  status: string;
  referencia_viaje: string | null;
  maniobra: string | null;
}

export interface VehicleReadApi {
  readonly id: number;
  readonly name: string;
}

interface VehicleBaseApi {
  id: number;
  name2: string;
  license_plate: string | null;
  serial_number: string | null;
  fleet_type: string | null;
  x_status: string;
  x_tipo_vehiculo: string | null;
  x_modalidad: string | null;
  x_tipo_carga: string | null;
  x_operador_asignado:number | null;

  state: SimpleData;
  category: SimpleData | null;
  brand: SimpleData | null; 
  res_store: SimpleData | null;
  res_company: SimpleData | null;
}

export interface VehicleApi extends VehicleBaseApi {
  tms_travel: TravelSimpleApi | null;
  maniobra: ManeuverSimpleApi | null;
  maintenance_records: MaintenanceRecordSimpleApi[];
}

export interface VehicleWithDriverApi extends VehicleBaseApi {
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
