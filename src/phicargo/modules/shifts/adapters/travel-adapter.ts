import type { Travel } from '../models/travels-models';
import type { TravelApi } from '../models/api/travel-models-models-api';
import dayjs from '../../core/utilities/dayjs-config';

export const travelToLocal = (travel: TravelApi): Travel => ({
  id: travel.id,
  branch: travel.branch,
  status: travel.x_status_viaje,
  vehicle: travel.vehicle,
  driver: travel.driver,
  latitude: travel.latitude,
  longitude: travel.longitude,
  distanceToBranch: travel.distance_to_branch,
  recordedAt: dayjs(travel.recorded_at),
});

