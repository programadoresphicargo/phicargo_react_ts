import dayjs from 'dayjs';
import type { Inspection, VehicleInspection } from '../models';
import type { InspectionApi, VehicleInspectionApi } from '../models/api';
import { VehicleAdapter } from './vehicle-adapter';
import { userBasicToLocal } from '@/modules/auth/adapters';
import { IncidentAdapter } from '@/modules/incidents/adapters';

export class VehicleInspectionAdapter {
  static toInspection(inspectionApi: InspectionApi): Inspection {
    return {
      id: inspectionApi.id,
      inspectionDate: dayjs(inspectionApi.inspection_date),
      result: inspectionApi.result,
      comments: inspectionApi.comments,
      inspector: userBasicToLocal(inspectionApi.inspector),
    };
  }

  static toVehicleInspection(
    vehicleInspectionApi: VehicleInspectionApi,
  ): VehicleInspection {
    return {
      ...VehicleAdapter.vehicleBaseToLocal(vehicleInspectionApi),
      inspection: vehicleInspectionApi.inspection
        ? VehicleInspectionAdapter.toInspection(vehicleInspectionApi.inspection)
        : null,
      driver: vehicleInspectionApi.driver
        ? IncidentAdapter.driverInfoToLocal(vehicleInspectionApi.driver)
        : null,
    };
  }
}

