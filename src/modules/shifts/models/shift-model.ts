import type { BranchSimple } from '../../core/models';
import type { Dayjs } from 'dayjs';
import type { ShiftTravelInfo } from './travels-models';
import type { UserBasic } from '../../auth/models';

export interface DriverInfo {
  id: number;
  name: string;
  license: string | null;
  licenseType: string | null;
  licenseExpiration: Dayjs | null;
  daysLeft: number | null;
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
  locked: boolean;
  maneuver1: string | null;
  maneuver2: string | null;
  archivedUserId: number | null;
  archivedDate: Dayjs | null;
  archivedReason: string | null;
  comments: string | null;
  registerDate: Dayjs;
  queue: boolean;
  has_recent_incident: boolean;
  cp_assigned: number | null;
}

export interface Shift extends ShiftBase {
  id: number;
  phoneNumber: string | null;
  branch: BranchSimple;
  driver: DriverInfo;
  vehicle: VehicleInfo;
  registerUser: UserBasic;
  travel: ShiftTravelInfo | null;
}

export type ShiftSimple = Pick<Shift, 'id' | 'shift' | 'arrivalAt' | 'driver'>;

export interface ShiftCreate {
  branchId: number;
  vehicleId: number;
  driverId: number;
  arrivalAt: Dayjs;
  comments: string;
  maneuver1: string | null;
  maneuver2: string | null;
}

export interface ShiftEdit {
  vehicleId?: number | null;
  arrivalAt?: Dayjs | null;
  driverId?: number | null;
  comments?: string | null;
  queue?: boolean | null;
  maneuver1?: string | null;
  maneuver2?: string | null;
  locked?: boolean | null;
}

export interface ShiftArchive {
  reason: string;
}

export interface ShiftReorder {
  shiftId: number;
  shift: number;
}

export interface Actividad {
  driver_id: number;
  driver: string;
  vehicle_id: number;
  vehicle: string;
  ruta: string;
  dias_transcurridos: number;
  fecha_finalizado: string;
}
