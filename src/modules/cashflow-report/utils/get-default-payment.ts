import type { Amount, Payment, PaymentCreate } from '../models';

const getFakeAmount = (amount: number): Amount => ({
  amount: amount,
  confirmed: false,
  realAmount: 0,
});

/**
 * Crear un registro de cobro temporal (utilizado para optimistic creation)
 * @param tempId ID temporal del registro
 * @param baseCollect Objeto con los datos base del registro
 * @returns Objeto con los datos del registro de cobro temporal
 */
export const getDefaultPayment = (
  tempId: number,
  basePayment: PaymentCreate,
): Payment => {
  const { amount, concept, day, providerId, weekId } = basePayment;

  return {
    id: tempId,
    concept: concept,
    weekId: weekId,
    providerId: providerId,
    providerName: 'Pending...',
    companyId: 0,
    companyName: 'Pending...',
    monday: getFakeAmount(day === 'monday' ? amount : 0),
    tuesday: getFakeAmount(day === 'tuesday' ? amount : 0),
    wednesday: getFakeAmount(day === 'wednesday' ? amount : 0),
    thursday: getFakeAmount(day === 'thursday' ? amount : 0),
    friday: getFakeAmount(day === 'friday' ? amount : 0),
    saturday: getFakeAmount(day === 'saturday' ? amount : 0),
    observations: '',
    totalConfirmed: 0,
    migratedFromWeekId: null,
  };
};
