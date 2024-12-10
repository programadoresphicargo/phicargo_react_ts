import { DaysOfWeek } from './base-models';
import { WeekBase } from './week-model';

export interface CollectRegister extends WeekBase {
  id: number;
  clientId: number;
  clientName: string;
  weekId: number;
  observations: string;
  totalConfirmed: number;
}

export interface CollectRegisterCreate {
  weekId: number;
  clientId: number;
  day: DaysOfWeek;
  mount: number;
}
