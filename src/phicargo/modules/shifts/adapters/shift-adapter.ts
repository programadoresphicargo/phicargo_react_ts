import type {
  DriverInfo,
  DriverInfoApi,
  Shift,
  ShiftApi,
  VehicleInfo,
  VehicleInfoApi,
} from '../models';

import dayjs from 'dayjs';

const driverInfoToLocal = (driver: DriverInfoApi): DriverInfo => ({
  id: driver.id,
  name: driver.name,
  license: driver.tms_driver_license_id,
  modality: driver.x_modalidad,
  isDangerous: driver.x_peligroso_lic === 'SI',
});

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
  registerUserId: shift.register_user_id,
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
});
