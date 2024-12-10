import { BranchSimple } from '../../../core/models';
import { MaintenanceRecordStatus } from '../maintenance-record-model';
import { WorkshopApi } from './workshop-api-model';

export interface VehicleInfoApi {
  id: number;
  name2: string;
  x_tipo_vehiculo: 'carretera' | 'local' | null;
  res_store: BranchSimple | null;
}

export interface MaintenanceRecordBaseApi {
  fail_type: 'MC' | 'EL';
  check_in: string;
  status: MaintenanceRecordStatus;
  delivery_date: string | null;
  supervisor: string;
  comments: string | null;
  order_service: string;
}

export interface MaintenanceRecordApi extends MaintenanceRecordBaseApi {
  id: number;
  check_out: string | null;
  vehicle: VehicleInfoApi;
  workshop: WorkshopApi;
  last_comment_date: string | null;
}

export interface MaintenanceRecordCreateApi extends MaintenanceRecordBaseApi {
  workshop_id: number;
  tract_id: number;
}

export interface MaintenanceRecordUpdateApi {
  workshop_id?: number | null;
  fail_type?: 'MC' | 'EL' | null;
  check_in?: string | null;
  check_out?: string | null;
  status?: MaintenanceRecordStatus | null;
  delivery_date?: string | null;
  supervisor?: string | null;
  comments?: string | null;
  order_service?: string | null;
}

export interface RecordCommentApi {
  id: number;
  maintenance_record_id: number;
  comment_text: string;
  created_at: string;
}

export interface RecordCommentCreateApi {
  comment_text: string;
}
