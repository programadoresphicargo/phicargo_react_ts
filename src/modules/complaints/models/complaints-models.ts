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
}

export interface ComplaintCreate extends ComplaintBase {
  customerId: number;
}

export interface Complaint extends ComplaintBase {
  id: number;
  status: ComplaintStatus;
  complaintDate: Dayjs;
  createdBy: UserRead;
  customer: Customer | null;
}

