import type { ShiftQueueStatus } from '../shift-queue-model';
import type { ShiftSimpleApi } from './shift-mode-api';
import type { UserBasicApi } from '@/phicargo/modules/auth/models';

interface QueueBaseApi {
  enqueue_date: string;
  release_date: string;
  comments: string | null;
  status: ShiftQueueStatus;
}

export interface QueueApi extends QueueBaseApi {
  id: number;
  shift: ShiftSimpleApi;
  user: UserBasicApi;
}

export type QueueCreateApi = Pick<
  QueueBaseApi,
  'enqueue_date' | 'release_date' | 'comments'
>;
