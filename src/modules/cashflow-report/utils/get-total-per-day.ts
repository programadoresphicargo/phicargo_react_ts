import { DaysOfWeek, WeekBase } from '../models';

/**
 * Function to calculate the total per day
 * @param data Data to calculate the total
 * @param day Dia de la semana
 * @returns Total per day
 */
export const getTotalPerDay = (data: WeekBase[], day: DaysOfWeek) => {
  return (
    data.reduce((acc, curr) => {
      const value = curr[day].amount;
      return acc + (isNaN(value) ? 0 : value);
    }, 0) || 0
  );
};
