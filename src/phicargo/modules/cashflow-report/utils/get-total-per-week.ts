import { DaysOfWeek } from '../models/base-models';
import { WeekBase } from '../models';

export const getTotalPerWeek = (data: WeekBase[]) => {
  const days: Array<DaysOfWeek> = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const total = data.reduce((total, curr) => {
    return (
      total +
      days.reduce((dayTotal, day) => {
        const value = curr[day].amount;
        return dayTotal + (isNaN(value) ? 0 : value);
      }, 0)
    );
  }, 0);

  return total;
};
