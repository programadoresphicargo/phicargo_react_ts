import type { Dayjs } from 'dayjs';
import type { UserBasic } from '../../auth/models';

export type IncidentType = 'operative' | 'legal';

export interface DriverInfo {
  id: number;
  name: string;
  license: string | null;
  modality: string | null;
  isDangerous: boolean;
}

interface IncidentBase {
  incident: string;
  comments: string;
  type: IncidentType;
}

export interface Incident extends IncidentBase {
  id: number;
  createdAt: Dayjs;
  user: UserBasic;
  driver: DriverInfo;
}

export interface IncidentCreate extends IncidentBase {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

