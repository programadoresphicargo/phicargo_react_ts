import type {
  MaintenanceRecord,
  MaintenanceRecordApi,
  MaintenanceRecordBase,
  MaintenanceRecordBaseApi,
  MaintenanceRecordCreate,
  MaintenanceRecordCreateApi,
  MaintenanceRecordUpdate,
  MaintenanceRecordUpdateApi,
  RecordComment,
  RecordCommentApi,
  RecordCommentCreate,
  RecordCommentCreateApi,
  VehicleInfo,
  VehicleInfoApi,
} from '../../models';

import dayjs from '@/utilities/dayjs-config';
import { workshopToLocal } from './workshop-mapper';

/**
 * Mapper to convert an object of type VehicleInfoApi to VehicleInfo
 * @param vehicle Object of type VehicleInfoApi
 * @returns Object of type VehicleInfo
 */
export const vehicleInfoToLocal = (vehicle: VehicleInfoApi): VehicleInfo => ({
  id: vehicle.id,
  name: vehicle.name2,
  vehicleType: vehicle.x_tipo_vehiculo,
  branch: vehicle.res_store
    ? {
        id: vehicle.res_store.id,
        name: vehicle.res_store.name,
      }
    : null,
});

/**
 * Mapper to convert an object of type MaintenanceRecordBaseApi to MaintenanceRecordBase
 * @param record Objetc of type MaintenanceRecordBaseApi
 * @returns Object of type MaintenanceRecordBase
 */
const maintenanceRecordBaseToLocal = (
  record: MaintenanceRecordBaseApi,
): MaintenanceRecordBase => ({
  failType: record.fail_type,
  checkIn: dayjs.utc(record.check_in).tz('America/Mexico_City'),
  status: record.status,
  deliveryDate: record.delivery_date
    ? dayjs.utc(record.delivery_date).tz('America/Mexico_City')
    : null,
  supervisor: record.supervisor,
  comments: record.comments,
  order: record.order_service,
});

/**
 * Mapper to convert an object of type MaintenanceRecordApi to MaintenanceRecord
 * @param record Object of type MaintenanceRecordApi
 * @returns Object of type MaintenanceRecord
 */
export const maintenanceRecordToLocal = (
  record: MaintenanceRecordApi,
): MaintenanceRecord => ({
  ...maintenanceRecordBaseToLocal(record),
  id: record.id,
  checkOut: record.check_out
    ? dayjs.utc(record.check_out).tz('America/Mexico_City')
    : null,
  vehicle: vehicleInfoToLocal(record.vehicle),
  workshop: workshopToLocal(record.workshop),
  lastCommentDate: record.last_comment_date
    ? dayjs.utc(record.last_comment_date).tz('America/Mexico_City')
    : null,
});

/**
 * Mapper to convert an object of type MaintenanceRecordCreate to MaintenanceRecordCreateApi
 * @param record Object of type MaintenanceRecordCreate
 * @returns Ojbect of type MaintenanceRecordCreateApi
 */
export const maintenanceRecordCreateToApi = (
  record: MaintenanceRecordCreate,
): MaintenanceRecordCreateApi => ({
  fail_type: record.failType,
  check_in: record.checkIn.format('YYYY-MM-DDTHH:mm:ss'),
  status: record.status,
  delivery_date: record.deliveryDate
    ? record.deliveryDate.format('YYYY-MM-DDTHH:mm:ss')
    : null,
  supervisor: record.supervisor,
  comments: record.comments,
  order_service: record.order,
  workshop_id: record.workshopId,
  tract_id: record.vehicleId,
});

/**
 * Mapper to convert an object of type MaintenanceRecordUpdate to MaintenanceRecordUpdateApi
 * @param record Object of type MaintenanceRecordUpdate
 * @returns Object of type MaintenanceRecordUpdateApi
 */
export const maintenanceRecordUpdateToApi = (
  record: MaintenanceRecordUpdate,
): MaintenanceRecordUpdateApi => {
  const data = {} as MaintenanceRecordUpdateApi;

  if (record.workshopId) {
    data.workshop_id = record.workshopId;
  }
  if (record.failType) {
    data.fail_type = record.failType;
  }
  if (record.checkIn) {
    data.check_in = record.checkIn.format('YYYY-MM-DDTHH:mm:ss');
  }
  if (record.checkOut) {
    data.check_out = record.checkOut.format('YYYY-MM-DDTHH:mm:ss');
  }
  if (record.status) {
    data.status = record.status;
  }
  if (record.deliveryDate) {
    data.delivery_date = record.deliveryDate.format('YYYY-MM-DDTHH:mm:ss');
  }
  if (record.supervisor) {
    data.supervisor = record.supervisor;
  }
  if (record.comments) {
    data.comments = record.comments;
  }
  if (record.order) {
    data.order_service = record.order;
  }
  return data;
};

/**
 * Mapper to convert an object of type RecordCommentApi to RecordComment
 * @param comment Object of type RecordCommentApi
 * @returns Object of type RecordComment
 */
export const recordCommentToLocal = (
  comment: RecordCommentApi,
): RecordComment => ({
  id: comment.id,
  recordId: comment.maintenance_record_id,
  comment: comment.comment_text,
  createdAt: dayjs.utc(comment.created_at).tz('America/Mexico_City'),
});

/**
 * Mapper to convert an object of type RecordCommentCreate to RecordCommentCreateApi
 * @param comment Object of type RecordCommentCreate
 * @returns Object of type RecordCommentCreateApi
 */
export const recordCommentToApi = (
  comment: RecordCommentCreate,
): RecordCommentCreateApi => ({
  comment_text: comment.comment,
});
