import type { Dayjs } from 'dayjs';
import type { UserRead } from '@/modules/users-management/models';

export type ComplaintActionStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'canceled';

export interface ComplaintActionBase {
  complaintId?: number | null;
  actionPlan: string;
  responsible: string;
  commitmentDate: Dayjs;
}

export type ComplaintActionCreate = ComplaintActionBase;

export interface ComplaintAction extends ComplaintActionBase {
  id: number;
  status: ComplaintActionStatus;
  createdAt: Dayjs;
  createdBy: UserRead;
}

