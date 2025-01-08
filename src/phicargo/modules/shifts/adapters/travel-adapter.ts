import type { Travel } from '../models/travels-models';
import type { TravelApi } from '../models/api/travel-models-models-api';
import dayjs from '../../core/utilities/dayjs-config';

export const travelToLocal = (travel: TravelApi): Travel => ({
  id: travel.id,
  name: travel.name,
  status: travel.x_status_viaje,
  operativeStatus: travel.operative_status,
  branch: travel.branch,
  driver: travel.driver,
  vehicle: travel.vehicle,
  latitude: travel.latitude,
  longitude: travel.longitude,
  recordedAt: travel.recorded_at ? dayjs(travel.recorded_at) : null,
  distanceToBranch: travel.distance_to_branch,
});

