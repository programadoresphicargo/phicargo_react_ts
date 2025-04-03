import type { Dayjs } from 'dayjs';
import type { UserBasic } from '../../auth/models';

export type IncidenceType = 'operative' | 'legal';

export interface DriverInfo {
  id: number;
  name: string;
  license: string | null;
  modality: string | null;
  isDangerous: boolean;
}

interface IncidenceBase {
  incidence: string;
  comments: string;
  type: IncidenceType;
}

export interface Incidence extends IncidenceBase {
  id: number;
  createdAt: Dayjs;
  user: UserBasic;
  driver: DriverInfo;
}

export interface IncidenceCreate extends IncidenceBase {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

