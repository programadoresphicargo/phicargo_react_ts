import type {
  Driver,
  DriverBase,
  DriverEdit,
  DriverPosturaSimple,
  DriverSimple,
} from '../models';
import type {
  DriverApi,
  DriverBaseApi,
  DriverEditApi,
  DriverPosturaSimpleApi,
  DriverSimpleApi,
} from '../models/api';

import { UnavailabilityAdapter } from './unavailability-adapter';
import dayjs from 'dayjs';

export class DriverAdapter {
  /**
   * Mapper function to convert a DriverBaseApi object to a DriverBase object
   * @param driver Driver object from the API
   * @returns DriverBase object for the local state
   */
  static driverBaseToLocal(driver: DriverBaseApi): DriverBase {
    return {
      id: driver.id,
      name: driver.name,
      isActive: driver.active,
      licenseId: driver.tms_driver_license_id,
      licenseType: driver.tms_driver_license_type,
      licenseExpiration: driver.tms_driver_license_expiration
        ? dayjs(driver.tms_driver_license_expiration)
        : null,
      noLicense: driver.no_licencia,
      modality: driver.x_modalidad,
      isDangerous: driver.x_peligroso_lic,
      status: driver.x_status,
      hireDate: driver.x_hire_date ? dayjs(driver.x_hire_date) : null,
      travelId: driver.x_viaje,
      maneuverId: driver.x_maniobra,
      job: driver.job,
      company: driver.res_company,
    };
  }

  /**
   * Mapper function to convert a DriverApi object to a Driver object
   * @param driver Object from the API
   * @returns Driver object for the local state
   */
  static driverToLocal(driver: DriverApi): Driver {
    return {
      ...DriverAdapter.driverBaseToLocal(driver),
      vehicle: driver.vehicle
        ? {
            id: driver.vehicle.id,
            name: driver.vehicle.name2,
            fleetType: driver.vehicle.fleet_type,
            status: driver.vehicle.x_status,
            modality: driver.vehicle.x_modalidad,
            loadType: driver.vehicle.x_tipo_carga,
            branch: driver.vehicle.branch,
          }
        : null,
      permission: driver.permission
        ? UnavailabilityAdapter.driverPermissionSimpleToLocal(driver.permission)
        : null,
      travel: driver.tms_travel
        ? {
            id: driver.tms_travel.id,
            name: driver.tms_travel.name,
            status: driver.tms_travel.x_status_viaje,
          }
        : null,
      maneuver: driver.maniobra
        ? {
            id: driver.maniobra.id_maniobra,
            type: driver.maniobra.tipo_maniobra,
            status: driver.maniobra.estado_maniobra,
            finishedDate: null,
          }
        : null,
      lastManeuver: driver.last_maneuver
        ? {
            id: driver.last_maneuver.id_maniobra,
            type: driver.last_maneuver.tipo_maniobra,
            status: driver.last_maneuver.estado_maniobra,
            finishedDate: driver.last_maneuver.fecha_finalizada
              ? dayjs(driver.last_maneuver.fecha_finalizada)
              : null,
          }
        : null,
      password: driver.password,
    };
  }

  /**
   * Mapper function to convert a DriverSimpleApi object to a DriverSimple object
   * @param driver DriverSimpleApi object from the API
   * @returns DriverSimple object for the local state
   */
  static driverSimpleToLocal(driver: DriverSimpleApi): DriverSimple {
    return {
      id: driver.id,
      name: driver.name,
      licenseId: driver.tms_driver_license_id,
      licenseType: driver.tms_driver_license_type,
      modality: driver.x_modalidad,
      status: driver.x_status,
      job: driver.job,
    };
  }

  static toDriverPosturaSimple(
    driver: DriverPosturaSimpleApi,
  ): DriverPosturaSimple {
    return {
      id: driver.id,
      name: driver.name,
      job: driver.job,
      startDate: dayjs(driver.start_date),
      endDate: dayjs(driver.end_date),
    };
  }

  /**
   * Mapper function to convert a DriverEdit object to a DriverEditApi object
   * @param driver DriverEdit object from the local state
   * @returns DriverEditApi object to send to the API
   */
  static driverUpdateToApi(driver: DriverEdit): DriverEditApi {
    const driverApi: DriverEditApi = {};

    if (driver.jobId) {
      driverApi.job_id = driver.jobId;
    }

    if (driver.licenseId) {
      driverApi.tms_driver_license_id = driver.licenseId;
    }

    if (driver.licenseType) {
      driverApi.tms_driver_license_type = driver.licenseType;
    }

    if (driver.modality) {
      driverApi.x_modalidad = driver.modality;
    }

    if (driver.isDangerous !== null || driver.isDangerous !== undefined) {
      driverApi.x_peligroso_lic = driver.isDangerous ? 'SI' : 'NO';
    }

    if (driver.isActive !== null || driver.isActive !== undefined) {
      driverApi.active = driver.isActive;
    }

    if (driver.hireDate) {
      driverApi.x_hire_date = driver.hireDate.format('YYYY-MM-DD');
    }

    return driverApi;
  }
}

