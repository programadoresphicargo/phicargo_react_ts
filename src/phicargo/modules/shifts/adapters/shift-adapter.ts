import type {
  DriverInfo,
  DriverInfoApi,
  Shift,
  ShiftApi,
  ShiftCreate,
  ShiftCreateApi,
  ShiftEdit,
  ShiftEditApi,
  VehicleInfo,
  VehicleInfoApi,
} from '../models';

import dayjs from 'dayjs';
import { userBasicToLocal } from '../../auth/adapters';

const driverInfoToLocal = (driver: DriverInfoApi): DriverInfo => ({
  id: driver.id,
  name: driver.name,
  license: driver.tms_driver_license_id,
  modality: driver.x_modalidad,
  isDangerous: driver.x_peligroso_lic === 'SI',
});

/**
 * Mapper to convert the data of a vehicle from the API to the local model
 * @param vehicle Object with the data of the vehicle
 * @returns Object with the data of the vehicle
 */
const vehicleInfoToLocal = (vehicle: VehicleInfoApi): VehicleInfo => ({
  id: vehicle.id,
  name: vehicle.name2,
  licensePlate: vehicle.license_plate,
  fleetType: vehicle.fleet_type,
  vehicleType: vehicle.x_tipo_vehiculo,
  modality: vehicle.x_modalidad,
  loadType: vehicle.x_tipo_carga,
});

/**
 * Mapper to convert the data of a shift from the API to the local model
 * @param shift Object with the data of the shift
 * @returns Objet with the data of the shift
 */
export const shiftToLocal = (shift: ShiftApi): Shift => ({
  id: shift.id,
  shift: shift.shift,
  arrivalAt: dayjs(shift.arrival_at),
  locked: shift.locked,
  maneuver1: shift.maneuver1,
  maneuver2: shift.maneuver2,
  archivedUserId: shift.archived_user_id,
  archivedDate: shift.archived_date ? dayjs(shift.archived_date) : null,
  archivedReason: shift.archived_reason,
  comments: shift.comments,
  registerDate: dayjs(shift.register_date),
  queue: shift.queue,
  driver: driverInfoToLocal(shift.driver),
  vehicle: vehicleInfoToLocal(shift.vehicle),
  branch: shift.res_store,
  registerUser: userBasicToLocal(shift.register_user),
});

/**
 * Mapper to convert the data of a shift from the API to the local model
 * @param shift Objetc with the data of the shift
 * @returns Object with the data of the shift
 */
export const shiftCreateToApi = (shift: ShiftCreate): ShiftCreateApi => ({
  branch_id: shift.branchId,
  vehicle_id: shift.vehicleId,
  driver_id: shift.driverId,
  arrival_at: shift.arrivalAt.format('YYYY-MM-DD HH:mm:ss'),
  comments: shift.comments,
  maneuver1: shift.maneuver1,
  maneuver2: shift.maneuver2,
});

/**
 * Mapper to convert the data of a shift from the local model to the API
 * @param shift Objetc with the data of the shift
 * @returns Object with the data of the shift
 */
export const shiftEditToApi = (shift: ShiftEdit): ShiftEditApi => {
  const shiftApi: ShiftEditApi = {};

  if (shift.vehicleId) {
    shiftApi.vehicle_id = shift.vehicleId;
  }

  if (shift.arrivalAt) {
    shiftApi.arrival_at = shift.arrivalAt.format('YYYY-MM-DD HH:mm:ss');
  }

  if (shift.driverId) {
    shiftApi.driver_id = shift.driverId;
  }

  if (shift.comments) {
    shiftApi.comments = shift.comments;
  }

  if (shift.queue !== undefined) {
    shiftApi.queue = shift.queue;
  }

  if (shift.maneuver1) {
    shiftApi.maneuver1 = shift.maneuver1;
  }

  if (shift.maneuver2) {
    shiftApi.maneuver2 = shift.maneuver2;
  }

  if (shift.locked !== undefined) {
    shiftApi.locked = shift.locked;
  }

  return shiftApi;
};

