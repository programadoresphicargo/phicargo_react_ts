import { CollectRegister } from '../models';

/**
 * Function to get the sum of the amount of each day of the week
 * @param data Object with the week data
 * @returns Returns the sum of the amount of each day of the week
 */
export const getProjection = (data: CollectRegister) => {

  if (data.observations != null) {
    return 0;
  }

  return (
    data.monday.amount +
    data.tuesday.amount +
    data.wednesday.amount +
    data.thursday.amount +
    data.friday.amount +
    data.saturday.amount
  );
};
