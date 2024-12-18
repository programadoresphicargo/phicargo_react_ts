import type {
  Vehicle,
  VehicleRealStatus,
  VehicleWithRealStatus,
} from '../models/vehicle-model';

/**
 * Utility function to determine the real status of a vehicle.
 */
const determineRealStatus = (vehicle: Vehicle): VehicleRealStatus => {
  if (vehicle.status === 'disponible' && vehicle?.state?.id === 1) {
    return 'available';
  }

  if (
    vehicle.status === 'viaje' &&
    vehicle?.state?.id === 1 &&
    vehicle.travel &&
    vehicle.travel.status !== 'finalizado'
  ) {
    return 'travel';
  }

  if (
    vehicle.status === 'maniobra' &&
    vehicle?.state?.id === 1 &&
    vehicle.maneuver &&
    vehicle.maneuver.status === 'activa'
  ) {
    return 'activeManeuver';
  }

  if (
    vehicle.status === 'maniobra' &&
    vehicle?.state?.id === 1 &&
    vehicle.maneuver &&
    vehicle.maneuver.status === 'borrador'
  ) {
    return 'draftManeuver';
  }

  if (vehicle?.state?.id === 5) {
    return 'maintenance';
  }

  if (vehicle?.state?.id === 4) {
    return 'sinister';
  }

  if (vehicle?.state?.id === 2) {
    return 'sale';
  }

  if (vehicle?.state?.id === 3) {
    return 'totalLoss';
  }

  return 'unknown';
}

/**
 * This class is responsible for transforming a list of vehicles with defined real statuses.
 */
class VehiclesWithRealStatus {
  constructor(private vehicles: Vehicle[]) {}

  /**
   * Transforms a single vehicle to include its real status.
   */
  private transformVehicle(vehicle: Vehicle): VehicleWithRealStatus {
    return { ...vehicle, realStatus: determineRealStatus(vehicle) };
  }

  /**
   * Transforms the list of vehicles and returns those with a valid real status.
   */
  public getVehiclesWithRealStatus(): VehicleWithRealStatus[] {
    return this.vehicles.map((vehicle) => this.transformVehicle(vehicle));
  }
}

export default VehiclesWithRealStatus;

