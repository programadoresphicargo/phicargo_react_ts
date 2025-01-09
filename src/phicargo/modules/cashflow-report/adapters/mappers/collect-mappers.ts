import type {
  CollectRegister,
  CollectRegisterApi,
  CollectRegisterCreate,
  Confirmation,
} from '../../models';

import { amountToLocal } from './amount-mapper';

/**
 * Mapper to convert CollectRegisterCreate to API
 * @param register Local object to be converted
 * @returns Object compatible with API
 */
export const collectRegisterToApi = (register: CollectRegisterCreate) => {
  return {
    week_id: register.weekId,
    client_id: register.clientId,
    company_id: register.companyId,
    [`${register.day}_amount`]: register.mount,
  };
};

/**
 * Mapper to convert CollectRegister to API
 * @param register Local object to be converted
 * @returns Object compatible with API
 */
export const collectRegisterToApiFull = (register: CollectRegister) => ({
  id: register.id,
  client_id: register.clientId,
  client_name: register.clientName,
  company_id: register.companyId,
  company_name: register.companyName,
  week_id: register.weekId,
  monday_amount: Number(register.monday),
  tuesday_amount: Number(register.tuesday),
  wednesday_amount: Number(register.wednesday),
  thursday_amount: Number(register.thursday),
  friday_amount: Number(register.friday),
  saturday_amount: Number(register.saturday),
  observations: register.observations,
});

/**
 * Mapper to convert CollectRegisterApi to CollectRegister
 * @param data Object from API
 * @returns Object converted
 */
export const collectRegisterToLocal = (
  data: CollectRegisterApi,
): CollectRegister => ({
  id: Number(data.id),
  clientId: Number(data.client_id),
  clientName: data.client_name,
  companyId: Number(data.company_id),
  companyName: data.company_name, 
  weekId: Number(data.week_id),
  monday: amountToLocal(data.monday_amount),
  tuesday: amountToLocal(data.tuesday_amount),
  wednesday: amountToLocal(data.wednesday_amount),
  thursday: amountToLocal(data.thursday_amount),
  friday: amountToLocal(data.friday_amount),
  saturday: amountToLocal(data.saturday_amount),
  observations: data.observations,
  totalConfirmed: Number(data.total_confirmed_amount),
  migratedFromWeekId: data?.migrated_from_week_id,
});

/**
 * Mapper to convert Confirmation to API
 * @param confirmation Local object to be converted
 * @returns Object compatible with API
 */
export const collectConfirmationToApi = (confirmation: Confirmation) => ({
  collect_id: confirmation.itemId,
  day_of_week: confirmation.dayOfWeek,
  confirmed: confirmation.confirmed,
  amount: confirmation.amount,
});
