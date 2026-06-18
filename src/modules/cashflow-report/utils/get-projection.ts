import { CollectRegister, Payment } from '../models';

/**
 * Function to get the sum of the amount of each day of the week
 * @param data Object with the week data
 * @returns Returns the sum of the amount of each day of the week
 */
export const getProjection = (data: Payment | CollectRegister) => {
  const days = [
    data.monday,
    data.tuesday,
    data.wednesday,
    data.thursday,
    data.friday,
    data.saturday,
  ];

  return days.reduce((acc, day) => {
    if (data.observations != null && day.confirmed === false) {
      return acc;
    }

    return acc + day.amount;
  }, 0);
};
