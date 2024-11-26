import type { Dayjs } from 'dayjs';

interface DriverUnavailabilityBase {
  startDate: Dayjs;
  endDate: Dayjs;
  employeeId: number;
  reasonType: string;
  description: string;
}

export type DriverUnavailabilityCreate = DriverUnavailabilityBase;

export interface DriverUnavailable extends DriverUnavailabilityBase {
  readonly id: number;
}
