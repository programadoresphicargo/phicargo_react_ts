interface DriverUnavailabilityBaseApi {
  start_date: string;
  end_date: string;
  employee_id: number;
  reason_type: string;
  description: string | null;
}

export type DriverUnavailabilityCreateApi = DriverUnavailabilityBaseApi;

export interface DriverUnavailableApi extends DriverUnavailabilityBaseApi {
  id: number;
}

export type DriverPermissionSimpleApi = Pick<
DriverUnavailabilityBaseApi,
  'start_date' | 'end_date' | 'reason_type' | 'description'
>;
