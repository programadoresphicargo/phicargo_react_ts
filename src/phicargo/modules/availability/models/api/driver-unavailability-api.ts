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
