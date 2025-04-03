import { DateRange } from 'rsuite/esm/DateRangePicker';

/**
 * Función que obtiene el rango de fechas de la semana actual
 * @returns DateRange
 */
export const getWeekRange = (): DateRange => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayOfMonth = today.getDate();

  // Si es domingo (0), ajustar para que comience desde el lunes
  const startOfWeek = new Date(today);
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(dayOfMonth + diffToMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Añadir 6 días para obtener el domingo

  return [startOfWeek, endOfWeek];
};
