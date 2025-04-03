import type { DriverInfo, Incidence, IncidenceCreate } from '../models';
import type { DriverInfoApi, IncidenceApi, IncidenceCreateApi } from '../models/api';

import dayjs from '@/utilities/dayjs-config';
import { userBasicToLocal } from '../../auth/adapters';

export class IncidenceAdapter {
  static driverInfoToLocal(driver: DriverInfoApi): DriverInfo {
    return {
      id: driver.id,
      name: driver.name,
      license: driver.tms_driver_license_id,
      modality: driver.x_modalidad,
      isDangerous: driver.x_peligroso_lic === 'SI',
    };
  }

  static driverIncidenceToLocal(incidence: IncidenceApi): Incidence {
    return {
      id: incidence.id,
      incidence: incidence.incidence,
      comments: incidence.comments,
      createdAt: dayjs(incidence.created_at),
      user: userBasicToLocal(incidence.user),
      driver: IncidenceAdapter.driverInfoToLocal(incidence.driver),
      type: incidence.type,
    };
  }

  static driverIncidentToApi(incidence: IncidenceCreate): IncidenceCreateApi {
    return {
      incidence: incidence.incidence,
      comments: incidence.comments,
      start_date: incidence.startDate ? incidence.startDate.format('YYYY-MM-DD') : null,
      end_date: incidence.endDate ? incidence.endDate.format('YYYY-MM-DD') : null,
      type: incidence.type,
    };
  }
}

