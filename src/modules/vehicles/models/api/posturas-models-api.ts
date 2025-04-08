import type { UserReadApi } from '@/modules/users-management/models';

interface PosturaBaseApi {
  reason: string;
}

export interface PosturaApi extends PosturaBaseApi {
  id: number;
  driver: string;
  vehicle_id: number;
  by_user: UserReadApi;
  created_at: string;
}

export interface PosturaCreateApi extends PosturaBaseApi {
  driver_id: number;
}

