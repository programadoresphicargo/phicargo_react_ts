import type { Driver } from '../models/driver-model';
import type { VehicleWithDriver } from '../models/vehicle-model';

type NotAssignedTypes = {
  vehicles: VehicleWithDriver[];
  drivers: Driver[];
  vehiclesAssigned: VehicleWithDriver[];
};

/**
 * Class to get the not assigned stats
 */
class NotAssignedStats {
  constructor(
    private readonly vehicles: VehicleWithDriver[],
    private readonly drivers: Driver[],
  ) {}

  private getVehiclesWithoutDriver(): VehicleWithDriver[] {
    return this.vehicles.filter((vehicle) => !vehicle.driver);
  }

  private getDriversWithoutVehicle(): Driver[] {
    return this.drivers.filter((driver) => !driver.vehicle);
  }

  private getVehiclesWithDriver(): VehicleWithDriver[] {
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

