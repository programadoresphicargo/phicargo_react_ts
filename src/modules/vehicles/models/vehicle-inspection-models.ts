import type { UserBasic } from '@/modules/auth/models';
import type { Dayjs } from 'dayjs';
import type { VehicleBase } from './vehicle-models';
import type { DriverInfo } from '@/modules/incidents/models';

export type InspectionResult = 'approved' | 'rejected';

export interface VehicleInspectionBase {
  inspectionDate: Dayjs;
  result: InspectionResult;
  comments: string | null;
}

export interface Inspection extends VehicleInspectionBase {
  id: string;
  inspector: UserBasic;
}

export interface VehicleInspection extends VehicleBase {
  inspection: Inspection | null;
  driver: DriverInfo | null;
}

export interface VehicleInspectionCreate extends VehicleInspectionBase {
  vehicleId: number;
  driverId?: number | null;
}

