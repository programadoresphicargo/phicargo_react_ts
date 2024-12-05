import type { Driver } from '../models/driver-model';
import dayjs from 'dayjs';

/**
 * Function to get the valid permission of a driver
 * @param driver Driver object
 * @returns Valid permission object if it exists, otherwise undefined
 */
export const getValidPermission = (driver: Driver) => {
  const today = dayjs();

  const validPermissions = driver.permissions.filter(
    (p) => p.endDate.isSame(today, 'day') || p.endDate.isAfter(today, 'day'),
  );

  return validPermissions.length > 0 ? validPermissions[0] : undefined;
};
