import { UserBasicApi } from '@/modules/auth/models';
import type { InspectionResult, InspectionType } from '../vehicle-inspection-models';
import { DriverInfoApi } from '@/modules/incidents/models/api';
import { VehicleBaseApi } from './vehicle-models-api';

export interface VehicleInspectionBaseApi {
  inspection_date: string;
  result: InspectionResult;
  comments: string | null;
  inspection_type: InspectionType;
  inspection_state: string | null;
  confirmed_date: string | null;
}

export interface InspectionApi extends VehicleInspectionBaseApi {
  id: number;
  inspector: UserBasicApi;
  incident_id: number | null;
  confirmed_by_user: string | null;
}

export interface VehicleInspectionApi extends VehicleBaseApi {
  inspection: InspectionApi | null;
  driver: DriverInfoApi | null;
}

export interface VehicleInspectionCreateApi extends VehicleInspectionBaseApi {
  vehicle_id: number;
  driver_id?: number | null;
  checklist: VehicleInspectionQuestionCreateApi[];
  user_pin: string;
}

// Checklist

export interface VehicleInspectionQuestionBaseApi {
  question: string;
  answer: unknown;
  question_type: 'boolean' | 'text' | 'file';
}

export type VehicleInspectionQuestionCreateApi = VehicleInspectionQuestionBaseApi;

export interface VehicleInspectionQuestionApi extends VehicleInspectionQuestionBaseApi {
  id: number;
}


