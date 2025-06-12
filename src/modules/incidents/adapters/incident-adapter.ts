import type {
  DriverInfo,
  Incident,
  IncidentCreate,
  IncidentUpdate,
  VehicleInfo,
} from '../models';
import type {
  DriverInfoApi,
  IncidentApi,
  IncidentCreateApi,
  IncidentUpdateApi,
  VehicleInfoApi,
} from '../models/api';

import dayjs from '@/utilities/dayjs-config';
import { userBasicToLocal } from '../../auth/adapters';
import { FilesAdapter } from '@/modules/core/adapters';

export class IncidentAdapter {
  static driverInfoToLocal(driver: DriverInfoApi): DriverInfo {
    return {
      id: driver.id,
      name: driver.name,
      license: driver.tms_driver_license_id,
      modality: driver.x_modalidad,
      isDangerous: driver.x_peligroso_lic === 'SI',
    };
  }

  static vehicleInfoToLocal(vehicle: VehicleInfoApi): VehicleInfo {
    return {
      id: vehicle.id,
      name: vehicle.name2,
      licensePlate: vehicle.license_plate,
      fleetType: vehicle.fleet_type,
      status: vehicle.x_status,
    };
  }

  static driverIncidentToLocal(incident: IncidentApi): Incident {
    return {
      id: incident.id,
      incident: incident.incidence,
      comments: incident.comments,
      incidentDate: incident.incident_date
        ? dayjs(incident.incident_date)
        : null,
      damageCost: incident.damage_cost,
      isDriverResponsible: incident.is_driver_responsible,
      createdAt: dayjs(incident.created_at),
      user: userBasicToLocal(incident.user),
      driver: IncidentAdapter.driverInfoToLocal(incident.driver),
      vehicle: incident.vehicle
        ? IncidentAdapter.vehicleInfoToLocal(incident.vehicle)
        : null,
      type: incident.type,
      evidences: incident.evidences?.map(FilesAdapter.toOneDriveFile) ?? [],
    };
  }

  static driverIncidentToApi(incident: IncidentCreate): IncidentCreateApi {
    return {
      incidence: incident.incident,
      comments: incident.comments,
      start_date: incident.startDate
        ? incident.startDate.format('YYYY-MM-DD')
        : null,
      end_date: incident.endDate ? incident.endDate.format('YYYY-MM-DD') : null,
      type: incident.type,
      vehicle_id: incident.vehicleId ?? null,
      new_vehicle_state_id: incident.newVehicleStateId ?? null,
      incident_date: incident.incidentDate
        ? incident.incidentDate.format('YYYY-MM-DD')
        : null,
      damage_cost: incident.damageCost ?? null,
      is_driver_responsible: incident.isDriverResponsible,
    };
  }

  static driverIncidentUpdateToApi(
    incident: IncidentUpdate
  ): IncidentUpdateApi {
    const data: IncidentUpdateApi = {};

    if (incident.incident) {
      data.incidence = incident.incident;
    }
    if (incident.comments) {
      data.comments = incident.comments;
    }
    if (incident.type) {
      data.type = incident.type;
    }
    if (incident.incidentDate) {  
      data.incident_date = incident.incidentDate.format('YYYY-MM-DD');
    }
    if (incident.damageCost !== undefined) {
      data.damage_cost = incident.damageCost;
    }
    if (incident.isDriverResponsible !== undefined) {
      data.is_driver_responsible = incident.isDriverResponsible;
    }
    if (incident.vehicleId !== undefined) {
      data.vehicle_id = incident.vehicleId ?? null;
    }
    if (incident.driverId !== undefined) {
      data.driver_id = incident.driverId ?? null;
    }
    return data;
  }
}

