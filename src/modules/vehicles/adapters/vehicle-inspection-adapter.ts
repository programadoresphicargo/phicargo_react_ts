import dayjs from 'dayjs';
import type {
  Inspection,
  VehicleInspection,
  VehicleInspectionCreate,
} from '../models';
import type {
  InspectionApi,
  VehicleInspectionApi,
  VehicleInspectionQuestionApi,
} from '../models/api';
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
      incidentId: inspectionApi.incident_id,
      inspectionType: inspectionApi.inspection_type,
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

  static toVehicleInspectionApi(
    vehicleInspection: VehicleInspectionCreate,
  ): FormData {
    const formData = new FormData();

    formData.append(
      'inspection_date',
      vehicleInspection.inspectionDate.format('YYYY-MM-DD'),
    );
    formData.append('result', vehicleInspection.result);
    formData.append('inspection_type', vehicleInspection.inspectionType);
    if (vehicleInspection.comments) {
      formData.append('comments', vehicleInspection.comments);
    }

    if (
      vehicleInspection.driverId !== null &&
      vehicleInspection.driverId !== undefined
    ) {
      formData.append('driver_id', String(vehicleInspection.driverId));
    }

    const filesToUpload: File[] = [];
    const checklist: VehicleInspectionQuestionApi[] = Object.entries(vehicleInspection.checklist).map(
      ([, value]) => {
        let answer = value.answer;
        if (typeof FileList !== 'undefined' && answer instanceof FileList) {
          const files = Array.from(answer).filter((file): file is File => file instanceof File);
          answer = files.map((file) => file.name);
          filesToUpload.push(...files);
        }
        return {
          question: value.question,
          answer,
          question_type: value.questionType
        };
      },
    );

    const checklistJson = JSON.stringify(checklist);
    formData.append('checklist', checklistJson);

    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });

    return formData;
  }
}

