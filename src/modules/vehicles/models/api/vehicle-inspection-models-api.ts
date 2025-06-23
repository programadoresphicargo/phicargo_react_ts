import { UserBasicApi } from '@/modules/auth/models';
import type { InspectionResult, InspectionType } from '../vehicle-inspection-models';
import { DriverInfoApi } from '@/modules/incidents/models/api';
import { VehicleBaseApi } from './vehicle-models-api';

export interface VehicleInspectionBaseApi {
  inspection_date: string;
  result: InspectionResult;
  comments: string | null;
  inspection_type: InspectionType;
}

export interface InspectionApi extends VehicleInspectionBaseApi {
  id: string;
  inspector: UserBasicApi;
  incident_id: number | null;
}

export interface VehicleInspectionApi extends VehicleBaseApi {
  inspection: InspectionApi | null;
  driver: DriverInfoApi | null;
}

export interface VehicleInspectionCreateApi extends VehicleInspectionBaseApi {
  vehicle_id: number;
  driver_id?: number | null;
  checklist: VehicleInspectionQuestionApi[];
}

// Checklist

export interface VehicleInspectionQuestionApi {
  question: string;
  answer: string | null | boolean | string[];
}


