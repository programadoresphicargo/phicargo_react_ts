import type { Dayjs } from 'dayjs';
import type { DriverInfo } from './shift-model';
import type { UserBasic } from '../../auth/models';

interface IncidenceBase {
  incidence: string;
  comments: string;
}

export interface Incidence extends IncidenceBase {
  id: number;
  createdAt: Dayjs;
  user: UserBasic;
  driver: DriverInfo;
}

export interface IncidenceCreate extends IncidenceBase {
  startDate: Dayjs;
  endDate: Dayjs;
}

