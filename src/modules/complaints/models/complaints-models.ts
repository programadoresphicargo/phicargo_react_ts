import { ComplaintActionCreate } from './complaint-actions-models';
import type { Dayjs } from 'dayjs';
import type { UserRead } from '@/modules/users-management/models';

interface Customer {
  id: number;
  name: string;
}

export type ComplaintStatus = 'open' | 'closed' | 'in_process';
export type ComplaintPriority = 'low' | 'medium' | 'high';

export interface ComplaintBase {
  phicargoCompany: string;
  responsible: string;
  area: string;
  complaintType: string;
  complaintDescription: string;
  complaintSuggestion: string;
  priority: ComplaintPriority;
  response: string | null;
  responseDate: Dayjs | null;
  origin: string;
  complaintDate: Dayjs;
}

export interface ComplaintCreate extends ComplaintBase {
  customerId: number;
  actions: ComplaintActionCreate[];
}

export type ComplaintUpdate = Partial<ComplaintCreate>;

export interface Complaint extends ComplaintBase {
  id: number;
  status: ComplaintStatus;
  createdAt: Dayjs;
  createdBy: UserRead;
  customer: Customer | null;
}

