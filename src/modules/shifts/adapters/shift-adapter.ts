import type {
  Actividad,
  ActividadApi,
  DriverInfo,
  DriverInfoApi,
  Shift,
  ShiftApi,
  ShiftCreate,
  ShiftCreateApi,
  ShiftEdit,
  ShiftEditApi,
  ShiftReorder,
  ShiftReorderApi,
  ShiftSimple,
  ShiftSimpleApi,
  VehicleInfo,
  VehicleInfoApi,
} from '../models';

import { ShiftTravelInfo } from '../models/travels-models';
import { ShiftTravelInfoApi } from '../models/api/travel-models-models-api';
import dayjs from 'dayjs';
import { userBasicToLocal } from '../../auth/adapters';

/**
 * Mapper to convert the data of a driver from the API to the local model
 * @param driver Object with the data of the driver
 * @returns Object with the data of the driver
 */
const driverInfoToLocal = (driver: DriverInfoApi): DriverInfo => ({
  id: driver.id,
  name: driver.name,
  license: driver.tms_driver_license_id,
  modality: driver.x_modalidad,
  isDangerous: driver.x_peligroso_lic === 'SI',
  licenseType: driver.tms_driver_license_type,
  licenseExpiration: driver.tms_driver_license_expiration,
  daysLeft: driver.dias_restantes,
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
 * Mapper to convert the data of a travel from the API to the local model
 * @param travel Object with the data of the travel
 * @returns Object with the data of the travel
 */
const travelInfoToLocal = (travel: ShiftTravelInfoApi): ShiftTravelInfo => {
  const startDate = dayjs(travel.date);
  const endDate = travel.end_date ? dayjs(travel.end_date) : null;
  const duration = endDate ? endDate.diff(startDate) : 0;
  const durationDays = Math.floor(duration / (1000 * 60 * 60 * 24));
  const durationHours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return {
    id: travel.id,
    name: travel.name,
    startDate: startDate,
    endDate: endDate,
    routeName: travel.route_name,
    duration: `${durationDays} días y ${durationHours} horas`
  };
};

/**
 * Mapper to convert the data of a shift from the API to the local model
 * @param shift Object with the data of the shift
 * @returns Objet with the data of the shift
 */
export const shiftToLocal = (shift: ShiftApi): Shift => ({
  id: shift.id,
  shift: shift.shift,
  phoneNumber: shift.phone,
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
  travel: shift.travel ? travelInfoToLocal(shift.travel) : null,
  has_recent_incident: shift.has_recent_incident,
  cp_assigned: shift.cp_assigned
});

/**
 * Mapper to convert the data of a shift from the API to the local model
 * @param shift Object with the data of the shift
 * @returns Object with the data of the shift
 */
export const shiftSimpleToLocal = (shift: ShiftSimpleApi): ShiftSimple => ({
  id: shift.id,
  shift: shift.shift,
  arrivalAt: dayjs(shift.arrival_at),
  driver: driverInfoToLocal(shift.driver),
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

/**
 * Mapper to convert the data of a shift from the local model to the API
 * @param shift Object with the data of the shift
 * @returns Object with the data of the shift
 */
export const shiftReorderToApi = (shift: ShiftReorder): ShiftReorderApi => ({
  shift_id: shift.shiftId,
  shift: shift.shift,
});

export const actividadToLocal = (item: ActividadApi): Actividad => ({
  operador: item.operador,
  dias_transcurridos: item.dias_transcurridos,
  vehiculo: item.vehiculo,
  ruta: item.ruta,
  fecha_finalizado: item.fecha_finalizado
});