import type {
  Confirmation,
  Payment,
  PaymentApi,
  PaymentCreate,
} from '../../models';

import { amountToLocal } from './amount-mapper';

/**
 * Mapper to convert PaymentApi to Payment
 * @param payment Object from API
 * @returns Objects converted
 */
export const paymentToLocal = (payment: PaymentApi): Payment => ({
  id: payment.id,
  monday: amountToLocal(payment.monday_amount),
  tuesday: amountToLocal(payment.tuesday_amount),
  wednesday: amountToLocal(payment.wednesday_amount),
  thursday: amountToLocal(payment.thursday_amount),
  friday: amountToLocal(payment.friday_amount),
  saturday: amountToLocal(payment.saturday_amount),
  providerId: payment.provider_id,
  weekId: payment.week_id,
  observations: payment.observations,
  concept: payment.concept,
  totalConfirmed: payment.total_confirmed_amount,
  migratedFromWeekId: payment?.migrated_from_week_id,
});

/**
 * Mapper to convert PaymentCreate to API
 * @param payment Local object to be converted
 * @returns Object compatible with API
 */
export const paymentToApi = (payment: PaymentCreate) => ({
  week_id: payment.weekId,
  provider_id: payment.providerId,
  concept: payment.concept,
  [`${payment.day}_amount`]: payment.amount,
});

/**
 * Mapper to convert Payment to API
 * @param payment Object to be converted
 * @returns Object converted
 */
export const paymentToApiFull = (payment: Payment) => ({
  id: payment.id,
  monday_amount: payment.monday,
  tuesday_amount: payment.tuesday,
  wednesday_amount: payment.wednesday,
  thursday_amount: payment.thursday,
  friday_amount: payment.friday,
  saturday_amount: payment.saturday,
  provider_id: payment.providerId,
  week_id: payment.weekId,
  observations: payment.observations,
  concept: payment.concept,
  total_confirmed_amount: payment.totalConfirmed,
});

/**
 * Mapper to convert Confirmation to API
 * @param confirmation Object to be converted
 * @returns Object converted
 */
export const paymentConfirmationToApi = (confirmation: Confirmation) => ({
  payment_id: confirmation.itemId,
  day_of_week: confirmation.dayOfWeek,
  confirmed: confirmation.confirmed,
  amount: confirmation.amount,
});
