import type {
  Vehicle,
  VehicleRead,
  VehicleWithDriver,
  VehicleWithTravelRef,
} from '../../models/vehicle-model';
import type {
  VehicleApi,
  VehicleReadApi,
  VehicleWithDriverApi,
  VehicleWithTravelRefApi,
} from '../../models/api/vehicle-model-api';

import { driverSimpleToLocal } from '../drivers/driver-mapper';

export const vehicleWithTravelRefToLocal = (
  vehicle: VehicleWithTravelRefApi,
): VehicleWithTravelRef => ({
  id: vehicle.id,
  name: vehicle.name,
  serialNumber: vehicle.serial_number || 'SIN ASIGNAR',
  licensePlate: vehicle.licence_plate || 'SIN ASIGNAR',
  fleetType: vehicle.fleet_type || 'SIN ASIGNAR',
  status: vehicle.status,
  travelReference: vehicle.referencia_viaje || '',
  maneuver: vehicle.maniobra || '',
});

export const vehicleReadToLocal = (vehicle: VehicleReadApi): VehicleRead => ({
  id: vehicle.id,
  name: vehicle.name,
});

export const vehicleToLocal = (vehicle: VehicleApi): Vehicle => ({
  id: vehicle.id,
  name: vehicle.name2,
  licensePlate: vehicle.license_plate || 'SIN ASIGNAR',
  serialNumber: vehicle.serial_number || 'SIN ASIGNAR',
  fleetType: vehicle.fleet_type || 'SIN ASIGNAR',
  status: vehicle.x_status,
  vehicleType: vehicle.x_tipo_vehiculo || 'SIN ASIGNAR',
  modality: vehicle.x_modalidad || 'SIN ASIGNAR',
  loadType: vehicle.x_tipo_carga || 'SIN ASIGNAR',
  driverId: vehicle.x_operador_asignado || 0,
  state: vehicle.state,
  category: vehicle.category || null,
  brand: vehicle.brand || null,
  branch: vehicle.res_store || null,
  company: vehicle.res_company || null,
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
});

export const vehicleWithDriverToLocal = (
  vehicle: VehicleWithDriverApi,
): VehicleWithDriver => ({
  id: vehicle.id,
  name: vehicle.name2,
  licensePlate: vehicle.license_plate || 'SIN ASIGNAR',
  serialNumber: vehicle.serial_number || 'SIN ASIGNAR',
  fleetType: vehicle.fleet_type || 'SIN ASIGNAR',
  status: vehicle.x_status,
  vehicleType: vehicle.x_tipo_vehiculo || 'SIN ASIGNAR',
  modality: vehicle.x_modalidad || 'SIN ASIGNAR',
  loadType: vehicle.x_tipo_carga || 'SIN ASIGNAR',
  driverId: vehicle.x_operador_asignado || 0,
  state: vehicle.state,
  category: vehicle.category || null,
  brand: vehicle.brand || null,
  branch: vehicle.res_store || null,
  company: vehicle.res_company || null,
  driver: vehicle.driver ? driverSimpleToLocal(vehicle.driver) : null,
});
