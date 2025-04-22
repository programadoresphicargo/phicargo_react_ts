import type {
  Complaint,
  ComplaintCreate,
  ComplaintUpdate,
} from '../models/complaints-models';
import type {
  ComplaintApi,
  ComplaintCreateApi,
  ComplaintUpdateApi,
} from '../models/api';

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

  static toComplaintUpdateApi(data: ComplaintUpdate): ComplaintUpdateApi {
    const complaint: ComplaintUpdateApi = {};

    if (data.phicargoCompany) {
      complaint.phicargo_company = data.phicargoCompany;
    }
    if (data.responsible) {
      complaint.responsible = data.responsible;
    }
    if (data.area) {
      complaint.area = data.area;
    }
    if (data.complaintType) {
      complaint.complaint_type = data.complaintType;
    }
    if (data.complaintDescription) {
      complaint.complaint_description = data.complaintDescription;
    }
    if (data.complaintSuggestion) {
      complaint.complaint_suggestion = data.complaintSuggestion;
    }
    if (data.priority) {
      complaint.priority = data.priority;
    }
    if (data.response) {
      complaint.response = data.response;
    }
    if (data.responseDate) {
      complaint.response_date = data.responseDate.format('YYYY-MM-DD');
    }
    if (data.origin) {
      complaint.origin = data.origin;
    }
    if (data.complaintDate) {
      complaint.complaint_date = data.complaintDate.format('YYYY-MM-DD');
    }
    if (data.status) {
      complaint.status = data.status;
    }

    return complaint;
  }
}

