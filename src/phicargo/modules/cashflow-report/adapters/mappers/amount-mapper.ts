import type { Amount, AmountApi } from '../../models';

/**
 * Mappert to convert AmountApi to Amount
 * @param amount Object to be converted
 * @returns Object converted
 */
export const amountToLocal = (amount: AmountApi): Amount => ({
  amount: Number(amount.amount),
  confirmed: amount.confirmed,
  realAmount: Number(amount.real_amount),
});
