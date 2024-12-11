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
  providerName: string;
  concept: string;
  companyId: number;
  companyName: string;
}

export interface PaymentCreate {
  weekId: number;
  providerId: number;
  concept: string;
  amount: number;
  day: DaysOfWeek;
  companyId: number;
}
