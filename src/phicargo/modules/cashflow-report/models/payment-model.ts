import { DaysOfWeek } from './base-models';
import { WeekBase } from './week-model';

/**
 * Modelo de datos de pagos
 */
export interface Payment extends WeekBase {
  id: number;
  observations: string;

  weekId: number;
  providerId: number;
  concept: string;
}

export interface PaymentCreate {
  weekId: number;
  providerId: number;
  concept: string;
  amount: number;
  day: DaysOfWeek;
}
