import type { Amount, CollectRegister, CollectRegisterCreate } from '../models';

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
export const getDefaultCollectRegister = (
  tempId: number,
  baseCollect: CollectRegisterCreate,
): CollectRegister => {
  const { clientId, weekId, day, mount } = baseCollect;

  return {
    id: tempId,
    clientId: clientId,
    clientName: 'Pending...',
    companyId: 0,
    companyName: 'Pending...',
    weekId: weekId,
    monday: getFakeAmount(day === 'monday' ? mount : 0),
    tuesday: getFakeAmount(day === 'tuesday' ? mount : 0),
    wednesday: getFakeAmount(day === 'wednesday' ? mount : 0),
    thursday: getFakeAmount(day === 'thursday' ? mount : 0),
    friday: getFakeAmount(day === 'friday' ? mount : 0),
    saturday: getFakeAmount(day === 'saturday' ? mount : 0),
    observations: '',
    totalConfirmed: 0,
    migratedFromWeekId: null,
  };
};
