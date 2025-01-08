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
  branch: string;
  status: string;
  vehicle: string;
  driver: string;
  latitude: number | null;
  longitude: number | null;
  distanceToBranch: number;
  recordedAt: Dayjs;
}

