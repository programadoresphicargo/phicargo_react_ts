import type { Driver } from '../models/driver-model';
import dayjs from 'dayjs';

/**
 * Function to get the valid permission of a driver
 * @param driver Driver object
 * @returns Valid permission object if it exists, otherwise undefined
 */
export const getValidPermission = (driver: Driver) => {
  const today = dayjs();

  const validPermissions = driver.permissions
    .filter(
      (p) =>
        p.endDate && 
        dayjs(p.endDate).isValid() && 
        (dayjs(p.endDate).isSame(today, 'day') || dayjs(p.endDate).isAfter(today, 'day')),
    )
    .sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate)));

  return validPermissions[0];
};
