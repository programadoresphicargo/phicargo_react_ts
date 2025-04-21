import type { ComplaintActionStatus } from '../complaint-actions-models';
import type { UserReadApi } from '@/modules/users-management/models';

export interface ComplaintActionBaseApi {
  complaint_id?: number | null;
  action_plan: string;
  responsible: string;
  commitment_date: string;
}

export type ComplaintActionCreateApi = ComplaintActionBaseApi;

export interface ComplaintActionApi extends ComplaintActionBaseApi {
  id: number;
  status: ComplaintActionStatus;
  created_at: string;
  created_by: UserReadApi;
}

