import type {
  BranchSimple,
  CompanySimple,
  ManeuverSimple,
  TravelSimple,
} from '../../core/models';
import type { DriverSimple, Modality } from './driver-model';

import type { MaintenanceRecordSimple } from '../../maintenance/models';
import type { SimpleData } from '../../core/types/global-types';

export type VehicleState = SimpleData;
export type VehicleCategory = SimpleData;
export type VehicleBrand = SimpleData;

export interface VehicleBase {
  readonly id: number;
  readonly name: string;
  licensePlate: string;
  serialNumber: string;
  fleetType: string;
  status: string;
  vehicleType: string;
  modality: Modality;
  loadType: string;

  state: VehicleState;
  category: VehicleCategory | null;
  brand: VehicleBrand | null;
  branch: BranchSimple | null;
  company: CompanySimple | null;
}

export interface Vehicle extends VehicleBase {
  travel: TravelSimple | null;
  maneuver: ManeuverSimple | null;
  maintenanceRecord: MaintenanceRecordSimple | null;
  driver: DriverSimple | null;
}

export interface VehicleSimple {
  readonly id: number;
  readonly name: string;
  fleetType: string;
  status: string;
  modality: string;
  loadType: string;
}

export interface VehicleUpdate {
  companyId?: number | null;
  branchId?: number | null;
  stateId?: number | null;
  driverId?: number | null;
  vehicleType?: string | null;
  modality?: Modality | null;
  typeLoad?: string | null;
}

export type VehicleRealStatus =
  | 'available'
  | 'travel'
  | 'activeManeuver'
  | 'draftManeuver'
  | 'maintenance'
  | 'sinister'
  | 'unknown';

export interface VehicleWithRealStatus extends Vehicle {
  readonly realStatus: VehicleRealStatus;
}

