import type { BranchSimple } from '../../core/models';
import { Dayjs } from 'dayjs';

export interface DriverInfo {
  id: number;
  name: string;
  license: string | null;
  modality: string | null;
  isDangerous: boolean;
}

export interface VehicleInfo {
  id: number;
  name: string;
  licensePlate: string | null;
  fleetType: string | null;
  vehicleType: string | null;
  modality: string | null;
  loadType: string | null;
}

export interface ShiftBase {
  shift: number;
  arrivalAt: Dayjs;
  registerUserId: number;
  locked: boolean;
  maneuver1: string | null;
  maneuver2: string | null;
  archivedUserId: number | null;
  archivedDate: Dayjs | null;
  archivedReason: string | null;
  comments: string | null;
  registerDate: Dayjs;
  queue: boolean;
}

export interface Shift extends ShiftBase {
  id: number;
  branch: BranchSimple;
  driver: DriverInfo;
  vehicle: VehicleInfo;
}

