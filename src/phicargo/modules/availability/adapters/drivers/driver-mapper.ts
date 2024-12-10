import type { Driver, DriverEdit, DriverSimple } from '../../models/driver-model';
import type {
  DriverApi,
  DriverBaseApi,
  DriverEditApi,
  DriverSimpleApi,
} from '../../models/api/driver-model-api';

import type { DriverBase } from '../../models/driver-model';
import { driverPermissionSimpleToLocal } from './driver-unavailability-mapper';

/**
 * Mapper function to convert a DriverBaseApi object to a DriverBase object
 * @param driver Driver object from the API
 * @returns DriverBase object for the local state
 */
const driverBaseToLocal = (driver: DriverBaseApi): DriverBase => ({
  id: driver.id,
  name: driver.name,
  isActive: driver.active,
  licenseId: driver.tms_driver_license_id,
  licenseType: driver.tms_driver_license_type,
  noLicense: driver.no_licencia,
  modality: driver.x_modalidad,
  isDangerous: driver.x_peligroso_lic,
  status: driver.x_status,
  travelId: driver.x_viaje,
  maneuverId: driver.x_maniobra,
  job: driver.job,
  company: driver.res_company,
});

/**
 * Mapper function to convert a DriverApi object to a Driver object
 * @param driver Object from the API
 * @returns Driver object for the local state
 */
export const driverToLocal = (driver: DriverApi): Driver => ({
  ...driverBaseToLocal(driver),
  vehicle: driver.vehicle.length > 0
    ? {
        id: driver.vehicle[0].id,
        name: driver.vehicle[0].name2,
        fleetType: driver.vehicle[0].fleet_type || 'SIN ASIGNAR',
        status: driver.vehicle[0].x_status,
        modality: driver.vehicle[0].x_modalidad || 'SIN ASIGNAR',
        loadType: driver.vehicle[0].x_tipo_carga || 'SIN ASIGNAR',
      }
    : null,
  permissions: driver.permissions.map(driverPermissionSimpleToLocal),
  travel: driver.tms_travel
    ? {
        id: driver.tms_travel.id,
        name: driver.tms_travel.name,
        status: driver.tms_travel.x_status_viaje || 'SIN ASIGNAR',
      }
    : null,
  maneuver: driver.maniobra
    ? {
        id: driver.maniobra.id_maniobra,
        type: driver.maniobra.tipo_maniobra,
        status: driver.maniobra.estado_maniobra,
      }
    : null,
});

/**
 * Mapper function to convert a DriverSimpleApi object to a DriverSimple object
 * @param driver DriverSimpleApi object from the API
 * @returns DriverSimple object for the local state
 */
export const driverSimpleToLocal = (driver: DriverSimpleApi): DriverSimple => ({
  id: driver.id,
  name: driver.name,
  licenseId: driver.tms_driver_license_id || 'SIN ASIGNAR',
  licenseType: driver.tms_driver_license_type || 'SIN ASIGNAR',
  modality: driver.x_modalidad,
  status: driver.x_status,
  job: driver.job,
});

/**
 * Mapper function to convert a DriverEdit object to a DriverEditApi object   
 * @param driver DriverEdit object from the local state
 * @returns DriverEditApi object to send to the API
 */
export const driverUpdateToApi = (driver: DriverEdit): DriverEditApi => ({
  job_id: driver.jobId,
  tms_driver_license_id: driver.licenseId,
  tms_driver_license_type: driver.licenseType,
  x_modalidad: driver.modality,
  x_peligroso_lic:
    driver.isDangerous === 'SI' || driver.isDangerous === 'NO'
      ? driver.isDangerous
      : null,
});
