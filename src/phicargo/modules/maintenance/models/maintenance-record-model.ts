import { BranchSimple } from '../../core/models';
import { Dayjs } from 'dayjs';
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

export interface MaintenanceRecordUpdate {
  workshopId?: number | null;
  failType?: 'MC' | 'EL' | null;
  checkIn?: Dayjs | null;
  checkOut?: Dayjs | null;
  status?: MaintenanceRecordStatus | null;
  deliveryDate?: Dayjs | null;
  supervisor?: string | null;
  comments?: string | null;
  order?: string | null;
}

export interface RecordComment {
  id: number;
  recordId: number;
  comment: string;
  createdAt: Dayjs;
}

export interface RecordCommentCreate {
  comment: string;
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

