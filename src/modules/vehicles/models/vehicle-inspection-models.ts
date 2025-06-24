import type { UserBasic } from '@/modules/auth/models';
import type { Dayjs } from 'dayjs';
import type { VehicleBase } from './vehicle-models';
import type { DriverInfo } from '@/modules/incidents/models';

export type InspectionResult = 'approved' | 'rejected';

export type InspectionType = 'cleaning' | 'legal';

export interface VehicleInspectionBase {
  inspectionDate: Dayjs;
  result: InspectionResult;
  comments: string | null;
  inspectionType: InspectionType;
}

export interface Inspection extends VehicleInspectionBase {
  id: string;
  inspector: UserBasic;
  incidentId: number | null;
}

export interface VehicleInspection extends VehicleBase {
  inspection: Inspection | null;
  driver: DriverInfo | null;
}

export interface VehicleInspectionCreate extends VehicleInspectionBase {
  vehicleId: number;
  driverId?: number | null;
  checklist: VehicleInspectionQuestionCreate[];
}

// Checklist

export interface VehicleInspectionQuestionBase {
  question: string;
  answer: unknown; // Puede ser boolean, string, etc.
  questionType: 'boolean' | 'text' | 'file';
}

export type VehicleInspectionQuestionCreate = VehicleInspectionQuestionBase;

export interface VehicleInspectionQuestion extends VehicleInspectionQuestionBase {
  id: number;
}

