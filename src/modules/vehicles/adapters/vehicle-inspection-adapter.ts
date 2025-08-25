import dayjs from 'dayjs';
import type {
  Inspection,
  VehicleInspection,
  VehicleInspectionCreate,
  VehicleInspectionQuestion,
} from '../models';
import type {
  InspectionApi,
  VehicleInspectionApi,
  VehicleInspectionQuestionApi,
  VehicleInspectionQuestionCreateApi,
} from '../models/api';
import { VehicleAdapter } from './vehicle-adapter';
import { userBasicToLocal } from '@/modules/auth/adapters';
import { IncidentAdapter } from '@/modules/incidents/adapters';
import { FilesAdapter } from '@/modules/core/adapters';
import { OneDriveFileApi } from '@/modules/core/models/api';

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
      inspectionState: inspectionApi.inspection_state,
      confirmedDate: inspectionApi.confirmed_date,
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

  static toVehicleInspectionQuestion(
    vehicleInspection: VehicleInspectionQuestionApi,
  ): VehicleInspectionQuestion {

    const { question_type, answer } = vehicleInspection;

    if (
      question_type === 'file' &&
      Array.isArray(answer) &&
      answer.length > 0 &&
      typeof answer[0] === 'object' &&
      'id_onedrive' in answer[0]
    ) {
      try {
        const aswerJson = answer.map((file: OneDriveFileApi) => {
          return FilesAdapter.toOneDriveFile(file);
        });
        vehicleInspection.answer = aswerJson;
      } catch (error) {
        console.error('Error processing file question type:', error);
      }
    }

    return {
      id: vehicleInspection.id,
      question: vehicleInspection.question,
      answer: vehicleInspection.answer,
      questionType: vehicleInspection.question_type,
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

    if (vehicleInspection.userPin) {
      formData.append('user_pin', vehicleInspection.userPin);
    }

    const filesToUpload: File[] = [];
    const checklist: VehicleInspectionQuestionCreateApi[] = Object.entries(
      vehicleInspection.checklist,
    ).map(([, value]) => {
      let answer = value.answer;
      if (typeof FileList !== 'undefined' && answer instanceof FileList) {
        const files = Array.from(answer).filter(
          (file): file is File => file instanceof File,
        );
        answer = files.map((file) => file.name);
        filesToUpload.push(...files);
      }
      return {
        question: value.question,
        answer,
        question_type: value.questionType,
      };
    });

    const checklistJson = JSON.stringify(checklist);
    formData.append('checklist', checklistJson);

    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });

    return formData;
  }
}

