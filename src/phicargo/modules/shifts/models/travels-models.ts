import type { Dayjs } from 'dayjs';

export interface ShiftTravelInfo {
  id: number;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs | null;
  routeName: string;
  duration: string;
}

export interface Travel {
  id: number;
  name: string;
  status: string;
  operativeStatus: string | null;
  branch: string;
  driver: string;
  vehicle: string;
  latitude: number | null;
  longitude: number | null;
  recordedAt: Dayjs | null;
  distanceToBranch: number | null;
}

