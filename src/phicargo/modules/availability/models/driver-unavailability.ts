import type { Dayjs } from 'dayjs';

interface DriverUnavailabilityBase {
  startDate: Dayjs;
  endDate: Dayjs;
  employeeId: number;
  reasonType: string;
  description: string;
  vacationDocId: number | null;
}

export type DriverUnavailabilityCreate = Omit<
  DriverUnavailabilityBase,
  'vacationDocId'
>;

export interface DriverUnavailable extends DriverUnavailabilityBase {
  readonly id: number;
}

export type DriverPermissionSimple = Pick<
  DriverUnavailabilityBase,
  'startDate' | 'endDate' | 'reasonType' | 'description'
>;

export interface DriverVacationSummary {
  id: number;
  employeeId: number;
  periodStart: Dayjs;
  periodEnd: Dayjs;
  yearsWorked: number;
  entitledDays: number;
  enjoyedDays: number;
  pendingDays: number;
}
