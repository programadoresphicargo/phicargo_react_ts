import type { Driver, DriverWithRealStatus } from '../models/driver-model';

import { getValidPermission } from './permission-valid';

/**
 * Utility function to determine the real status of a driver.
 */
const determineRealStatus = (driver: Driver): string => {
  const validPermission = getValidPermission(driver);

  if (validPermission) {
    return validPermission.reasonType;
  }

  if (driver.status === 'disponible') {
    return 'available';
  }

  if (
    driver.status === 'viaje' &&
    driver.travel &&
    driver.travel.status !== 'finalizado'
  ) {
    return 'travel';
  }

  if (
    driver.status === 'maniobra' &&
    driver.maneuver &&
    driver.maneuver.status === 'activa'
  ) {
    return 'activeManeuver';
  }

  if (
    driver.status === 'maniobra' &&
    driver.maneuver &&
    driver.maneuver.status === 'borrador'
  ) {
    return 'draftManeuver';
  }

  return 'unknown';
};

/**
 * This class is responsible for transforming a list of drivers with defined real statuses.
 */
class DriversWithRealStatus {
  constructor(private drivers: Driver[]) {}

  /**
   * Transforms a single driver to include its real status.
   */
  private transformDriver(driver: Driver): DriverWithRealStatus {
    return { ...driver, realStatus: determineRealStatus(driver) };
  }

  /**
   * Transforms the list of drivers and returns those with a valid real status.
   */
  public getVehiclesWithRealStatus(): DriverWithRealStatus[] {
    return this.drivers.map((d) => this.transformDriver(d));
  }
}

export default DriversWithRealStatus;

