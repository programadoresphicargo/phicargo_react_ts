import type { BranchSimple } from '../../core/models';
import { Dayjs } from 'dayjs';

export interface DriverInfo {
  id: number;
  name: string;
  license: string | null;
  isDangerous: boolean;
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
  plates: string | null;
  comments: string | null;
  registerDate: Dayjs;
  queue: boolean;
}

export interface Shift extends ShiftBase {
  id: number;
  branch: BranchSimple;
  driver: DriverInfo;
}

