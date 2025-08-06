import type {
  BranchSimple,
  CompanySimple,
  ManeuverSimple,
  TravelSimple,
} from '../../core/models';
import {
  DriverPosturaSimple,
  DriverSimple,
  Modality,
} from '../../drivers/models';

import { Dayjs } from 'dayjs';
import type { MaintenanceRecordSimple } from '../../maintenance/models';

import { SimpleData } from '@/types';
export type VehicleState = SimpleData;
export type VehicleCategory = SimpleData;
export type VehicleBrand = SimpleData;

export interface VehicleBase {
  readonly id: number;
  readonly name: string;
  licensePlate: string | null;
  serialNumber: string | null;
  fleetType: string | null;
  status: string;
  vehicleType: string | null;
  modality: Modality | null;
  loadType: string | null;

  state: VehicleState | null;
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
  driverPostura: DriverPosturaSimple | null;
}

export interface VehicleSimple {
  readonly id: number;
  readonly name: string;
  fleetType: string | null;
  status: string;
  modality: string | null;
  loadType: string | null;
  branch: string | null;
}

export interface VehicleUpdate {
  companyId?: number | null;
  branchId?: number | null;
  stateId?: number | null;
  driverId?: number | null;
  vehicleType?: string | null;
  modality?: Modality | null;
  typeLoad?: string | null;
  branchChangeDate?: string | null;
}

export type VehicleRealStatus =
  | 'available'
  | 'travel'
  | 'activeManeuver'
  | 'draftManeuver'
  | 'maintenance'
  | 'sinister'
  | 'sale'
  | 'totalLoss'
  | 'unknown';

export interface VehicleWithRealStatus extends Vehicle {
  readonly realStatus: VehicleRealStatus;
}

export interface VehicleStatusChangeEvent {
  id: number;
  vehicleId: number;
  status: string;
  previousStatus: string | null;
  startDate: Dayjs;
  endDate: Dayjs | null;
  deliveryDate: Dayjs | null;
}

// Trailer models

export interface Trailer {
  readonly id: number;
  readonly name: string;
  licensePlate: string | null;
  serialNumber: string | null;
  fleetType: string | null;
  status: string;

  state: VehicleState | null;
  category: VehicleCategory | null;
  brand: VehicleBrand | null;

  travel: TravelSimple | null;
  maneuver: ManeuverSimple | null;
  driver: DriverSimple | null;
  driverPostura: DriverPosturaSimple | null;
}

export interface TrailerDriverAssignment {
  driverId: number | null;
  trailerId: number;
}

// Fleet models

export interface Fleet {
  id: number;
  name: string;
  licensePlate: string | null;
  status: string | null;
  sucursalViaje: string | null;
  tipoVehiculo: string | null;
  fleetType: string | null;
  trailerDriver: string | null;
  driver: string | null;
  lastTravelId: number | null;
  referenciaViaje: string | null;
  lastTravelEndDate: Dayjs | null;
  storeId: number | null;
  operadorViaje: string | null;
  lastManeuverId: number | null;
  tipoManeuver: string | null;
  lastManeuverEndDate: Dayjs | null;
  operadorManeuver: string | null;
  ultimoUso: string | null;
  ultimoUsoFecha: Dayjs | null;
}

// Motum events

export type MotumEventStatus = 'pending' | 'attended'

export interface MotumEvent {
  id: number;
  eventType: number;
  event: string;
  eventTypeName: string;
  eventDescription: string | null;
  vehicleName: string;
  createdAt: Dayjs;
  status: MotumEventStatus;
  latitude: number;
  longitude: number;
  attendedAt: Dayjs | null;
  attendedBy: string | null;
  comment: string | null;
}

