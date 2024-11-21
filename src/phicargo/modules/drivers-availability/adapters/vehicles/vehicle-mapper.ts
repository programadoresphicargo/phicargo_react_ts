import { VehicleRead } from "../../models/vehicle-model";
import { VehicleReadApi } from "../../models/api/vehicle-model-api";

export const vehicleReadToLocal = (vehicle: VehicleReadApi): VehicleRead => ({
  id: vehicle.id,
  name: vehicle.name,
});
