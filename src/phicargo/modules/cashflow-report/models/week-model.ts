import { Amount } from './base-models';

export interface WeekBase {
  monday: Amount;
  tuesday: Amount;
  wednesday: Amount;
  thursday: Amount;
  friday: Amount;
  saturday: Amount;

  totalConfirmed: number;
  migratedFromWeekId: number | null;
}

export interface Week {
  id: number;
  startDate: string;
  endDate: string;
}
