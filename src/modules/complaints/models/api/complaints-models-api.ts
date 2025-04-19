import type { ComplaintPriority, ComplaintStatus } from '../complaints-models';

import type { UserReadApi } from '@/modules/users-management/models';

interface Customer {
  id: number;
  name: string;
}

export interface ComplaintBaseApi {
  phicargo_company: string;
  responsible: string;
  area: string;
  complaint_type: string;
  complaint_description: string;
  complaint_suggestion: string;
  priority: ComplaintPriority;
  response: string | null;
  response_date: string | null;
}

export interface ComplaintCreateApi extends ComplaintBaseApi {
  customer_id: number;
}

export interface ComplaintApi extends ComplaintBaseApi {
  id: number;
  status: ComplaintStatus;
  complaint_date: string;
  created_by: UserReadApi;
  customer: Customer | null;
}

