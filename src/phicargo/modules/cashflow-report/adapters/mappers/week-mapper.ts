/**
 * Mapper to convert the week to API format
 * @param startDate Start date of the week
 * @param endDate End date of the week
 * @returns Object with the week in API format
 */
export const weekToApi = (startDate: Date, endDate: Date) => {
  // Asegurar que las fechas no tengan tiempo asociado
  const setToMidnight = (date: Date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(0, 0, 0, 0); // Fijar la hora a 00:00:00
    return adjustedDate;
  };

  const start = setToMidnight(startDate);
  const end = setToMidnight(endDate);

  return {
    start_date: start.toISOString().split('T')[0],
    end_date: end.toISOString().split('T')[0],
  };
};
