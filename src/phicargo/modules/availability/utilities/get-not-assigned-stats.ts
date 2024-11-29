import type { Driver } from '../models/driver-model';
import type { Vehicle } from '../models/vehicle-model';

type NotAssignedTypes = {
  vehicles: Vehicle[];
  drivers: Driver[];
  vehiclesAssigned: Vehicle[];
};

/**
 * Class to get the not assigned stats
 */
class NotAssignedStats {
  constructor(
    private readonly vehicles: Vehicle[],
    private readonly drivers: Driver[],
  ) {}

  private getVehiclesWithoutDriver(): Vehicle[] {
    return this.vehicles.filter((vehicle) => !vehicle.driver);
  }

  private getDriversWithoutVehicle(): Driver[] {
    return this.drivers.filter((driver) => !driver.vehicle);
  }

  private getVehiclesWithDriver(): Vehicle[] {
    return this.vehicles.filter((vehicle) => vehicle.driver);
  }

  public getNotAssignedStats(): NotAssignedTypes {
    return {
      vehicles: this.getVehiclesWithoutDriver(),
      drivers: this.getDriversWithoutVehicle(),
      vehiclesAssigned: this.getVehiclesWithDriver(),
    };
  }
}

export default NotAssignedStats;

