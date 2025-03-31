import { Dayjs } from 'dayjs';

export interface DayOffBase {
  dateOff: Dayjs;
  type: string;
  description: string;
}

export interface DayOff extends DayOffBase {
  id: string;
}

export type DayOffCreate = DayOffBase & {
  storeId: number | null;
};

