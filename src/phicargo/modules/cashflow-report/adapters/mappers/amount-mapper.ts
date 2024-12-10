import type { Amount, AmountApi } from '../../models';

/**
 * Mappert to convert AmountApi to Amount
 * @param amount Object to be converted
 * @returns Object converted
 */
export const amountToLocal = (amount: AmountApi): Amount => ({
  amount: amount.amount,
  confirmed: amount.confirmed,
  realAmount: amount.real_amount,
});
