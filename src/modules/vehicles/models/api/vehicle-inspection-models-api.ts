import { UserBasicApi } from '@/modules/auth/models';
import { InspectionResult } from '../vehicle-inspection-models';
import { DriverInfoApi } from '@/modules/incidents/models/api';
import { VehicleBaseApi } from './vehicle-models-api';

export interface VehicleInspectionBaseApi {
  inspection_date: string;
  result: InspectionResult;
  comments: string | null;
}

export interface InspectionApi extends VehicleInspectionBaseApi {
  id: string;
  inspector: UserBasicApi;
}

export interface VehicleInspectionApi extends VehicleBaseApi {
  inspection: InspectionApi | null;
  driver: DriverInfoApi | null;
}

export interface VehicleInspectionCreateApi extends VehicleInspectionBaseApi {
  vehicle_id: number;
}

