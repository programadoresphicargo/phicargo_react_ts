import { ComplaintActionCreate } from './complaint-actions-models';
import type { Dayjs } from 'dayjs';
import type { UserRead } from '@/modules/users-management/models';
import { CausaRaizCreate } from './causa_raiz';

interface Customer {
  id: number;
  name: string;
}

export type ComplaintStatus = 'open' | 'closed' | 'in_process' | 'resolved';
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
  customerId: number | null;
  elaboroId: number | null;
  revisoId: number | null;
  autorizoId: number | null;
}

export type ComplaintUpdate = Partial<ComplaintBase> & {
  status?: ComplaintStatus;
};

export interface ComplaintForm extends ComplaintBase {
  customerId: number | null;
  actions?: ComplaintActionCreate[];
  causa_raiz?: CausaRaizCreate;
  status?: ComplaintStatus;
}

export interface Complaint extends ComplaintBase {
  id: number;
  status: ComplaintStatus;
  createdAt: Dayjs;
  createdBy: UserRead;
  customer: Customer | null;
}

