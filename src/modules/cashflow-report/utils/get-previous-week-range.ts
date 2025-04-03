import type { DateRange } from 'rsuite/esm/DateRangePicker/types';

/**
 * Función que obtiene el rango de fechas de la semana anterior
 * @returns DateRange
 */
export const getPreviousWeekRange = (date: DateRange): DateRange => {
  const actualWeekStart: Date = date[0];

  const previousWeekStart = new Date(actualWeekStart);
  previousWeekStart.setDate(actualWeekStart.getDate() - 7);

  const previousWeekEnd = new Date(actualWeekStart);
  previousWeekEnd.setDate(actualWeekStart.getDate() - 1);

  return [previousWeekStart, previousWeekEnd];
};
