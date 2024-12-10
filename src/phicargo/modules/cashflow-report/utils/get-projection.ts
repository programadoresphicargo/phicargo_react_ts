import { WeekBase } from '../models';

/**
 * Function to get the sum of the amount of each day of the week
 * @param data Object with the week data
 * @returns Returns the sum of the amount of each day of the week
 */
export const getProjection = (data: WeekBase) => {
  return (
    data.monday.amount +
    data.tuesday.amount +
    data.wednesday.amount +
    data.thursday.amount +
    data.friday.amount +
    data.saturday.amount
  );
};
