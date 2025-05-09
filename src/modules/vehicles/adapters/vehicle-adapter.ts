import type {
  MotumEvent,
  Trailer,
  Vehicle,
  VehicleBase,
  VehicleStatusChangeEvent,
  VehicleUpdate,
} from '../models';
import type {
  MotumEventAPI,
  TrailerApi,
  VehicleApi,
  VehicleBaseApi,
  VehicleStatusChangeEventApi,
  VehicleUpdateApi,
} from '../models/api';

import { DriverAdapter } from '../../drivers/adapters';
import dayjs from 'dayjs';

export class VehicleAdapter {
  /**
   * Mapper function to convert a VehicleBaseApi object to a VehicleBase object
   * @param vehicle Object of type VehicleBaseApi
   * @returns Object of type VehicleBase
   */
  static vehicleBaseToLocal(vehicle: VehicleBaseApi): VehicleBase {
    return {
      id: vehicle.id,
      name: vehicle.name2,
      licensePlate: vehicle.license_plate,
      serialNumber: vehicle.serial_number,
      fleetType: vehicle.fleet_type,
      status: vehicle.x_status,
      vehicleType: vehicle.x_tipo_vehiculo,
      modality: vehicle.x_modalidad,
      loadType: vehicle.x_tipo_carga,
      state: vehicle.state,
      category: vehicle.category || null,
      brand: vehicle.brand || null,
      branch: vehicle.res_store || null,
      company: vehicle.res_company || null,
    };
  }

  /**
   * Mapper function to convert a VehicleApi object to a Vehicle object
   * @param vehicle Object of type VehicleApi
   * @returns Object of type Vehicle
   */
  static vehicleToLocal(vehicle: VehicleApi): Vehicle {
    return {
      ...VehicleAdapter.vehicleBaseToLocal(vehicle),
      travel: vehicle.tms_travel
        ? {
            id: vehicle.tms_travel.id,
            name: vehicle.tms_travel.name,
            status: vehicle.tms_travel.x_status_viaje,
          }
        : null,
      maneuver: vehicle.maniobra
        ? {
            id: vehicle.maniobra.id_maniobra,
            type: vehicle.maniobra.tipo_maniobra,
            status: vehicle.maniobra.estado_maniobra,
            finishedDate: vehicle.maniobra.fecha_finalizada
              ? dayjs(vehicle.maniobra.fecha_finalizada)
              : null,
          }
        : null,
      maintenanceRecord: vehicle.maintenance_records
        ? {
            id: vehicle.maintenance_records.id,
            orderService: vehicle.maintenance_records.order_service,
          }
        : null,
      driver: vehicle.driver
        ? DriverAdapter.driverSimpleToLocal(vehicle.driver)
        : null,
      driverPostura: vehicle.driver_postura
        ? DriverAdapter.toDriverPosturaSimple(vehicle.driver_postura)
        : null,
    };
  }

  static toTrailer(trailer: TrailerApi): Trailer {
    return {
      id: trailer.id,
      name: trailer.name2,
      licensePlate: trailer.license_plate,
      serialNumber: trailer.serial_number,
      fleetType: trailer.fleet_type,
      status: trailer.x_status,

      state: trailer.state,
      category: trailer.category || null,
      brand: trailer.brand || null,

      travel: trailer.tms_travel
        ? {
            id: trailer.tms_travel.id,
            name: trailer.tms_travel.name,
            status: trailer.tms_travel.x_status_viaje,
          }
        : null,
      maneuver: trailer.maniobra
        ? {
            id: trailer.maniobra.id_maniobra,
            type: trailer.maniobra.tipo_maniobra,
            status: trailer.maniobra.estado_maniobra,
            finishedDate: trailer.maniobra.fecha_finalizada
              ? dayjs(trailer.maniobra.fecha_finalizada)
              : null,
          }
        : null,
      driver: trailer.driver
        ? DriverAdapter.driverSimpleToLocal(trailer.driver)
        : null,
      driverPostura: trailer.driver_postura
        ? DriverAdapter.toDriverPosturaSimple(trailer.driver_postura)
        : null,
    };
  }

  /**
   * Mapper function to convert a VehicleUpdateApi object to a VehicleUpdate object
   * @param vehicle Vehicle object
   * @returns VehicleUpdate object to be used in the form
   */
  static vehicleUpdateToApi(vehicle: VehicleUpdate): VehicleUpdateApi {
    const vehicleApi: VehicleUpdateApi = {};

    if (vehicle.companyId) {
      vehicleApi.company_id = vehicle.companyId;
    }

    if (vehicle.branchId) {
      vehicleApi.x_sucursal = vehicle.branchId;
    }

    if (vehicle.stateId) {
      vehicleApi.state_id = vehicle.stateId;
    }

    if (vehicle.driverId) {
      vehicleApi.x_operador_asignado = vehicle.driverId;
    }

    if (vehicle.vehicleType) {
      vehicleApi.x_tipo_vehiculo = vehicle.vehicleType;
    }

    if (vehicle.modality) {
      vehicleApi.x_modalidad = vehicle.modality;
    }

    if (vehicle.typeLoad) {
      vehicleApi.x_tipo_carga = vehicle.typeLoad;
    }

    return vehicleApi;
  }

  static toVehicleStatusChangeEvent(
    data: VehicleStatusChangeEventApi,
  ): VehicleStatusChangeEvent {
    return {
      id: data.id,
      vehicleId: data.vehicle_id,
      status: data.status,
      previousStatus: data.previous_status,
      startDate: dayjs(data.start_date),
      endDate: data.end_date ? dayjs(data.end_date) : null,
      deliveryDate: data.delivery_date ? dayjs(data.delivery_date) : null,
    };
  }

  static toMotumEvent(data: MotumEventAPI): MotumEvent {
    return {
      id: data.id,
      eventType: data.event_type,
      event: data.event,
      eventTypeName: data.event_type_name,
      eventDescription: data.event_description,
      vehicleName: data.vehicle_name,
      createdAt: dayjs(data.created_at),
      status: data.status,
      latitude: data.latitude,
      longitude: data.longitude,
      attendedAt: data.attended_at ? dayjs(data.attended_at) : null,
      attendedBy: data.attended_by,
      comment: data.comment,
    };
  }
}

