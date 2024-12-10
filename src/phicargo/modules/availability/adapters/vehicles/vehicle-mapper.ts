import type { Vehicle, VehicleBase, VehicleUpdate } from '../../models/vehicle-model';
import type {
  VehicleApi,
  VehicleBaseApi,
  VehicleUpdateApi,
} from '../../models/api/vehicle-model-api';

import { driverSimpleToLocal } from '../drivers/driver-mapper';

/**
 * Mapper function to convert a VehicleBaseApi object to a VehicleBase object
 * @param vehicle Object of type VehicleBaseApi
 * @returns Object of type VehicleBase
 */
const vehicleBaseToLocal = (vehicle: VehicleBaseApi): VehicleBase => ({
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
});

/**
 * Mapper function to convert a VehicleApi object to a Vehicle object
 * @param vehicle Object of type VehicleApi
 * @returns Object of type Vehicle
 */
export const vehicleToLocal = (vehicle: VehicleApi): Vehicle => ({
  ...vehicleBaseToLocal(vehicle),
  travel: vehicle.tms_travel
    ? {
        id: vehicle.tms_travel.id,
        name: vehicle.tms_travel.name,
        status: vehicle.tms_travel.x_status_viaje || 'SIN ASIGNAR',
      }
    : null,
  maneuver: vehicle.maniobra
    ? {
        id: vehicle.maniobra.id_maniobra,
        type: vehicle.maniobra.tipo_maniobra,
        status: vehicle.maniobra.estado_maniobra,
      }
    : null,
  maintenanceRecord:
    vehicle.maintenance_records.length > 0
      ? {
          id: vehicle.maintenance_records[0].id,
          orderService: vehicle.maintenance_records[0].order_service || 'N/A',
        }
      : null,
  driver: vehicle.driver ? driverSimpleToLocal(vehicle.driver) : null,
});

/**
 * Mapper function to convert a VehicleUpdateApi object to a VehicleUpdate object
 * @param vehicle Vehicle object
 * @returns VehicleUpdate object to be used in the form
 */
export const vehicleUpdateToApi = (vehicle: VehicleUpdate): VehicleUpdateApi => {

  const vehicleApi: VehicleUpdateApi = {};

  if (vehicle.companyId){
    vehicleApi.company_id = vehicle.companyId;
  }

  if (vehicle.branchId){
    vehicleApi.x_sucursal = vehicle.branchId;
  }

  if (vehicle.stateId){
    vehicleApi.state_id = vehicle.stateId;
  }

  if (vehicle.driverId){
    vehicleApi.x_operador_asignado = vehicle.driverId;
  }

  if (vehicle.vehicleType){
    vehicleApi.fleet_type = vehicle.vehicleType;
  }

  if (vehicle.modality){
    vehicleApi.x_modalidad = vehicle.modality;
  }

  if (vehicle.typeLoad){
    vehicleApi.x_tipo_carga = vehicle.typeLoad;
  }

  return vehicleApi;

}

