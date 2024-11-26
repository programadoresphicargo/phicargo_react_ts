import type {
  BranchSimple,
  CompanySimple,
  ManeuverSimple,
  TravelSimple,
} from '../../core/models';

import { MaintenanceRecordSimple } from '../../maintenance/models';

interface SimpleData {
  id: number;
  name: string;
}

export interface VehicleWithTravelRef {
  id: number;
  name: string;
  serialNumber: string;
  licensePlate: string;
  fleetType: string;
  status: string;
  travelReference: string;
  maneuver: string;
}

export interface VehicleRead {
  readonly id: number;
  readonly name: string;
}

interface VehicleBase {
  id: number;
  name: string;
  licensePlate: string;
  serialNumber: string;
  fleetType: string;
  status: string;
  vehicleType: string;
  modality: string;
  loadType: string;
  driverId: number;
}

export interface Vehicle extends VehicleBase {
  state: VehicleState;
  category: VehicleCategory | null;
  brand: VehicleBrand | null;
  branch: BranchSimple | null;
  company: CompanySimple | null;
  travel: TravelSimple | null;
  maneuver: ManeuverSimple | null;
  maintenanceRecord: MaintenanceRecordSimple | null;
}

export type VehicleState = SimpleData;

export type VehicleCategory = SimpleData;

export type VehicleBrand = SimpleData;

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
