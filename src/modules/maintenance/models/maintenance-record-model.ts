import { BranchSimple } from '../../core/models';
import { Dayjs } from 'dayjs';
import { UserRead } from '../../users-management/models';
import { Workshop } from './workshop.model';

export type MaintenanceRecordStatus = 'pending' | 'completed' | 'cancelled';

export interface VehicleInfo {
  id: number;
  name: string;
  vehicleType: 'carretera' | 'local' | null;
  branch: BranchSimple | null;
}

export interface MaintenanceRecordBase {
  failType: 'MC' | 'EL';
  checkIn: Dayjs;
  status: MaintenanceRecordStatus;
  deliveryDate: Dayjs | null;
  supervisor: string;
  comments: string | null;
  order: string;
}

export interface MaintenanceRecord extends MaintenanceRecordBase {
  id: number;
  checkOut: Dayjs | null;
  vehicle: VehicleInfo;
  workshop: Workshop;
  lastCommentDate: Dayjs | null;
}

export interface MaintenanceRecordCreate extends MaintenanceRecordBase {
  workshopId: number;
  vehicleId: number;
}

export type MaintenanceRecordUpdate = Partial<
  Pick<
    MaintenanceRecordCreate,
    'workshopId' | 'failType' | 'status' | 'deliveryDate' | 'supervisor'
  > & { updateComments: string, checkOut: Dayjs }
>;

export interface RecordComment {
  id: number;
  recordId: number;
  comment: string;
  createdAt: Dayjs;
  byUser: UserRead;
}

export interface RecordCommentCreate {
  comment: string;
}

export interface RecordUpdateComment {
  id: number;
  recordId: number;
  comment: string;
  changeDate: Dayjs;
  previousDeliveryDate: Dayjs;
  newDeliveryDate: Dayjs;
  byUser: UserRead;
}

export interface RecordStats {
  pending: number;
  completed: number;
}

export interface MaintenanceRecordSimpleApi {
  id: number;
  order_service: string | null;
}

export interface MaintenanceRecordSimple {
  id: number;
  orderService: string | null;
}

