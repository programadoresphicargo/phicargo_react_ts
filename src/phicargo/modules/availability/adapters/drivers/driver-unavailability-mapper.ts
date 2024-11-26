import {
  DriverUnavailabilityCreate,
  DriverUnavailable,
} from '../../models/driver-unavailability';
import {
  DriverUnavailabilityCreateApi,
  DriverUnavailableApi,
} from '../../models/api/driver-unavailability-api';

import dayjs from 'dayjs';

export const driverUnavailabilityToLocal = (
  unavailiability: DriverUnavailableApi,
): DriverUnavailable => ({
  id: unavailiability.id,
  startDate: dayjs(unavailiability.start_date),
  endDate: dayjs(unavailiability.end_date),
  employeeId: unavailiability.employee_id,
  reasonType: unavailiability.reason_type,
  description: unavailiability.description || '',
});

export const driverUnavailabilityToApi = (
  item: DriverUnavailabilityCreate,
): DriverUnavailabilityCreateApi => ({
  start_date: item.startDate.format('YYYY-MM-DD'),
  end_date: item.endDate.format('YYYY-MM-DD'),
  employee_id: item.employeeId,
  reason_type: item.reasonType,
  description: item.description,
});
