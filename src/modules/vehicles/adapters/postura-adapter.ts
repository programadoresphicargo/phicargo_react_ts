import type { Postura, PosturaCreate } from '../models';
import type { PosturaApi, PosturaCreateApi } from '../models/api';

import { UserAdapter } from '@/modules/users-management/adapters';
import dayjs from 'dayjs';

export class PosturaAdapter {
  static toPostura(data: PosturaApi): Postura {
    return {
      id: data.id,
      driver: data.driver,
      vehicleId: data.vehicle_id,
      byUser: UserAdapter.userReadToLocal(data.by_user),
      createdAt: dayjs(data.created_at),
      reason: data.reason,
      startDate: dayjs(data.start_date),
      endDate: dayjs(data.end_date),
    };
  }

  static toPosturaCreateApi(data: PosturaCreate): PosturaCreateApi {
    return {
      driver_id: data.driverId,
      reason: data.reason,
      start_date: data.startDate.format('YYYY-MM-DD'),
      end_date: data.endDate.format('YYYY-MM-DD'),
    };
  }
}

