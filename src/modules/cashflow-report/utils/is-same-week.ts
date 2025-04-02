import { isAfter, isEqual } from 'date-fns';

import { DateRange } from 'rsuite/esm/DateRangePicker';
import { getWeekRange } from './get-week-range';

const setToMidnight = (date: Date) => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(0, 0, 0, 0);
  return adjustedDate;
};

/**
 * Function to check if the given week is the same as the current week
 * @param week DateRange with the start and end of the week
 * @returns true if the given week is the same as the current week
 */
export const isSameWeek = (week: DateRange): boolean => {
  if (!week) return false;

  const actualWeek = getWeekRange();
  const actualWeekStart = actualWeek[0];
  const actualWeekEnd = actualWeek[1];

  const weekStart = week[0];
  const weekEnd = week[1];

  const start = setToMidnight(weekStart);
  const end = setToMidnight(weekEnd);

  return (
    actualWeekStart.toISOString().split('T')[0] ===
      start.toISOString().split('T')[0] &&
    actualWeekEnd.toISOString().split('T')[0] ===
      end.toISOString().split('T')[0]
  );
};

/**
 * Function to check if the given week is the same or after the current week
 * @param week DateRange with the start and end of the week
 * @returns true if the given week is the same or after the current week
 */
export const isGOEWeek = (week: DateRange): boolean => {
  if (!week) return false;

  const actualWeekStart = setToMidnight(getWeekRange()[0]);
  const weekStart = setToMidnight(week[0]);

  // Verifica si la semana dada es la misma o después de la semana actual
  return (
    isEqual(weekStart, actualWeekStart) || isAfter(weekStart, actualWeekStart)
  );
};
