import type { Complaint, ComplaintCreate } from '../models/complaints-models';
import type { ComplaintApi, ComplaintCreateApi } from '../models/api';

import { ComplaintActionsAdapter } from './complaint-actions-adapter';
import { UserAdapter } from '@/modules/users-management/adapters';
import dayjs from 'dayjs';

export class ComplaintsAdapter {
  static toComplaint(data: ComplaintApi): Complaint {
    return {
      id: data.id,
      status: data.status,
      complaintDate: dayjs(data.complaint_date),
      createdBy: UserAdapter.userReadToLocal(data.created_by),
      customer: data.customer,
      phicargoCompany: data.phicargo_company,
      responsible: data.responsible,
      area: data.area,
      complaintType: data.complaint_type,
      complaintDescription: data.complaint_description,
      complaintSuggestion: data.complaint_suggestion,
      priority: data.priority,
      response: data.response,
      responseDate: data.response_date ? dayjs(data.response_date) : null,
      origin: data.origin,
      createdAt: dayjs(data.created_at),
    };
  }

  static toComplaintCreateApi(data: ComplaintCreate): ComplaintCreateApi {
    return {
      phicargo_company: data.phicargoCompany,
      responsible: data.responsible,
      area: data.area,
      complaint_type: data.complaintType,
      complaint_description: data.complaintDescription,
      complaint_suggestion: data.complaintSuggestion,
      priority: data.priority,
      response: data.response,
      customer_id: data.customerId,
      response_date: data.responseDate
        ? data.responseDate.format('YYYY-MM-DD')
        : null,
      origin: data.origin,
      complaint_date: data.complaintDate.format('YYYY-MM-DD'),
      actions: data.actions.map(
        ComplaintActionsAdapter.toComplaintActionCreateApi,
      ),
    };
  }
}

