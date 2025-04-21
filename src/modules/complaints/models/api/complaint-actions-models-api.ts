export interface ComplaintActionBaseApi {
  complaint_id?: number | null;
  action_plan: string;
  responsible: string;
  commitment_date: string;
}

export type ComplaintActionCreateApi = ComplaintActionBaseApi;
