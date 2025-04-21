import { ComplaintActionCreate } from '../models/complaint-actions-models';
import { ComplaintActionCreateApi } from '../models/api';
export class ComplaintActionsAdapter {
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
}

