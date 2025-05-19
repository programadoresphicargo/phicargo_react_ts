import type {
  DriverPermissionSimple,
  DriverUnavailabilityCreate,
  DriverUnavailable,
  DriverVacationSummary,
} from '../models';
import type {
  DriverPermissionSimpleApi,
  DriverUnavailabilityCreateApi,
  DriverUnavailableApi,
  DriverVacationSummaryApi,
} from '../models/api';

import dayjs from 'dayjs';

export class UnavailabilityAdapter {
  static driverUnavailabilityToLocal(
    unavailiability: DriverUnavailableApi,
  ): DriverUnavailable {
    return {
      id: unavailiability.id,
      startDate: dayjs(unavailiability.start_date),
      endDate: dayjs(unavailiability.end_date),
      employeeId: unavailiability.employee_id,
      reasonType: unavailiability.reason_type,
      description: unavailiability.description || '',
      vacationDocId: unavailiability.vacation_doc_id,
      isActive: unavailiability.is_active,
    };
  }

  static driverUnavailabilityToApi(
    item: DriverUnavailabilityCreate,
  ): DriverUnavailabilityCreateApi {
    return {
      start_date: item.startDate.format('YYYY-MM-DD'),
      end_date: item.endDate.format('YYYY-MM-DD'),
      employee_id: item.employeeId,
      reason_type: item.reasonType,
      description: item.description,
    };
  }

  /**
   * Mapper to convert a driver permission data from API to local format
   * @param permission Object with the driver permission data
   * @returns Objet with the driver permission data
   */
  static driverPermissionSimpleToLocal(
    permission: DriverPermissionSimpleApi,
  ): DriverPermissionSimple {
    return {
      startDate: dayjs(permission.start_date),
      endDate: dayjs(permission.end_date),
      reasonType: permission.reason_type,
      description: permission.description || '',
    };
  }

  static driverVacationSummaryToLocal(
    vacationSummary: DriverVacationSummaryApi,
  ): DriverVacationSummary {
    return {
      id: vacationSummary.id,
      employeeId: vacationSummary.employee_id,
      periodStart: dayjs(vacationSummary.period_start),
      periodEnd: dayjs(vacationSummary.period_end),
      yearsWorked: vacationSummary.years_worked,
      entitledDays: vacationSummary.entitled_days,
      enjoyedDays: vacationSummary.enjoyed_days,
      pendingDays: vacationSummary.pending_days,
    };
  }
}
