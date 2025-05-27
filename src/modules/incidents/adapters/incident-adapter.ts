import type { DriverInfo, Incident, IncidentCreate } from '../models';
import type {
  DriverInfoApi,
  IncidentApi,
  IncidentCreateApi,
} from '../models/api';

import dayjs from '@/utilities/dayjs-config';
import { userBasicToLocal } from '../../auth/adapters';

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

  static driverIncidentToLocal(incident: IncidentApi): Incident {
    return {
      id: incident.id,
      incident: incident.incidence,
      comments: incident.comments,
      createdAt: dayjs(incident.created_at),
      user: userBasicToLocal(incident.user),
      driver: IncidentAdapter.driverInfoToLocal(incident.driver),
      type: incident.type,
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
    };
  }
}

