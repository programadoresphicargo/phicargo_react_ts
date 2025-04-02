import type { Dayjs } from 'dayjs';
import type { ShiftSimple } from './shift-model';
import type { UserBasic } from '../../auth/models/auth-models';

export type ShiftQueueStatus = 'queued' | 'released';

interface QueueBase {
  enqueueDate: Dayjs;
  releaseDate: Dayjs;
  comments: string | null;
  status: ShiftQueueStatus;
}

export interface Queue extends QueueBase {
  id: number;
  shift: ShiftSimple;
  user: UserBasic;
}

export type QueueCreate = Pick<
  QueueBase,
  'enqueueDate' | 'releaseDate' | 'comments'
>;

