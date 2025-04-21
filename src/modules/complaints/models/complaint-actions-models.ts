import { Dayjs } from 'dayjs';

export interface ComplaintActionBase {
  complaintId?: number | null;
  actionPlan: string;
  responsible: string;
  commitmentDate: Dayjs;
}

export type ComplaintActionCreate = ComplaintActionBase;
