import { BranchSimple } from '../../../core/models';
import { MaintenanceRecordStatus } from '../maintenance-record-model';
import { UserReadApi } from '@/modules/users-management/models';
import { WorkshopApi } from './workshop-api-model';

export interface VehicleInfoApi {
  id: number;
  name2: string;
  x_tipo_vehiculo: 'carretera' | 'local' | null;
  vehicle_type_id: number | null;
  res_store: BranchSimple | null;
}

export interface MaintenanceRecordBaseApi {
  fail_type: 'MC' | 'EL' | 'PV';
  check_in: string;
  status: MaintenanceRecordStatus;
  delivery_date: string | null;
  supervisor: string;
  comments: string | null;
  order_service: string;
  days_in_workshop: number | null;
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

export type MaintenanceRecordUpdateApi = Partial<
  Pick<
    MaintenanceRecordCreateApi,
    | 'workshop_id'
    | 'fail_type'
    | 'status'
    | 'delivery_date'
    | 'supervisor'
    | 'check_in'
    | 'order_service'
  > & { update_comments: string; check_out: string }
>;

export interface RecordCommentApi {
  id: number;
  maintenance_record_id: number;
  comment_text: string;
  created_at: string;
  by_user: UserReadApi;
}

export interface RecordCommentCreateApi {
  comment_text: string;
}

export interface RecordUpdateCommentApi {
  id: number;
  maintenance_record_id: number;
  comment: string;
  change_date: string;
  previous_delivery_date: string;
  new_delivery_date: string;
  by_user: UserReadApi;
}

