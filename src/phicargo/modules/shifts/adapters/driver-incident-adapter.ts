import type { DriverInfo, DriverInfoApi } from '../models';
import type {
  Incidence,
  IncidenceCreate,
} from '../models/driver-incidence-model';
import type {
  IncidenceApi,
  IncidenceCreateApi,
} from '../models/api/driver-incidence-model-api';

import dayjs from '@/utilities/dayjs-config';
import { userBasicToLocal } from '../../auth/adapters';

const driverInfoToLocal = (driver: DriverInfoApi): DriverInfo => ({
  id: driver.id,
  name: driver.name,
  license: driver.tms_driver_license_id,
  modality: driver.x_modalidad,
  isDangerous: driver.x_peligroso_lic === 'SI',
});

export const driverIncidenceToLocal = (incidence: IncidenceApi): Incidence => ({
  id: incidence.id,
  incidence: incidence.incidence,
  comments: incidence.comments,
  createdAt: dayjs(incidence.created_at),
  user: userBasicToLocal(incidence.user),
  driver: driverInfoToLocal(incidence.driver),
});

export const driverIncidentToApi = (
  incidence: IncidenceCreate,
): IncidenceCreateApi => ({
  incidence: incidence.incidence,
  comments: incidence.comments,
  start_date: incidence.startDate.format('YYYY-MM-DD'), 
  end_date: incidence.endDate.format('YYYY-MM-DD'),
});

