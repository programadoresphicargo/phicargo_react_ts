interface DriverUnavailabilityBaseApi {
  start_date: string;
  end_date: string;
  employee_id: number;
  reason_type: string;
  description: string | null;
  vacation_doc_id: number | null;
}

export type DriverUnavailabilityCreateApi = Omit<
  DriverUnavailabilityBaseApi,
  'vacation_doc_id'
>;

export interface DriverUnavailableApi extends DriverUnavailabilityBaseApi {
  id: number;
  is_active: boolean;
}

export type DriverPermissionSimpleApi = Pick<
  DriverUnavailabilityBaseApi,
  'start_date' | 'end_date' | 'reason_type' | 'description'
>;

export interface DriverVacationSummaryApi {
  id: number;
  employee_id: number;
  period_start: string;
  period_end: string;
  years_worked: number;
  entitled_days: number;
  enjoyed_days: number;
  pending_days: number;
}
