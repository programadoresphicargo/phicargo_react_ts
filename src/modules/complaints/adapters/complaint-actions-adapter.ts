import type {
  ComplaintAction,
  ComplaintActionCreate,
  ComplaintActionUpdate,
} from '../models/complaint-actions-models';
import type {
  ComplaintActionApi,
  ComplaintActionCreateApi,
  ComplaintActionUpdateApi,
} from '../models/api';

import { UserAdapter } from '@/modules/users-management/adapters';
import dayjs from 'dayjs';

export class ComplaintActionsAdapter {
  static toComplaintAction(data: ComplaintActionApi): ComplaintAction {
    return {
      id: data.id,
      complaintId: data.complaint_id,
      actionPlan: data.action_plan,
      responsible: data.responsible,
      status: data.status,
      commitmentDate: dayjs(data.commitment_date),
      createdAt: dayjs(data.created_at),
      createdBy: UserAdapter.userReadToLocal(data.created_by),
    };
  }

  static toComplaintActionCreateApi(
    data: ComplaintActionCreate,
  ): ComplaintActionCreateApi {
    return {
      complaint_id: data.complaintId ?? null,
      action_plan: data.actionPlan,
      responsible: data.responsible,
      commitment_date: data.commitmentDate.format('YYYY-MM-DD'),
    };
  }

  static toComplaintActionUpdateApi(
    data: ComplaintActionUpdate,
  ): ComplaintActionUpdateApi {
    const complaint: ComplaintActionUpdateApi = {};

    if (data.actionPlan) {
      complaint.action_plan = data.actionPlan;
    }
    if (data.responsible) {
      complaint.responsible = data.responsible;
    }
    if (data.status) {
      complaint.status = data.status;
    }
    if (data.commitmentDate) {
      complaint.commitment_date = data.commitmentDate.format('YYYY-MM-DD');
    }
    return complaint;
  }
}

