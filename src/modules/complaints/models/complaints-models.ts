import type { Dayjs } from 'dayjs';
import type { UserRead } from '@/modules/users-management/models';

interface Customer {
  id: number;
  name: string;
}

export interface ComplaintBase {
  phicargoCompany: string;
  responsible: string;
  area: string;
  complaintType: string;
  complaintDescription: string;
  complaintSuggestion: string;
  priority: string;
  response: string | null;
  responseDate: Dayjs | null;
}

export interface ComplaintCreate extends ComplaintBase {
  customerId: number;
}

export interface Complaint extends ComplaintBase {
  id: number;
  status: string;
  complaintDate: Dayjs;
  createdBy: UserRead;
  customer: Customer | null;
}

