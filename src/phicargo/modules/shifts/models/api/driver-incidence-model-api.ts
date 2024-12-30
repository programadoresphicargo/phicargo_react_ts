import type { DriverInfoApi } from './shift-mode-api';
import type { UserBasicApi } from '@/phicargo/modules/auth/models';

interface IncidenceBaseApi {
  incidence: string;
  comments: string;
}

export interface IncidenceApi extends IncidenceBaseApi {
  id: number;
  created_at: string;
  user: UserBasicApi;
  driver: DriverInfoApi;
}

export type IncidenceCreateApi = IncidenceBaseApi

