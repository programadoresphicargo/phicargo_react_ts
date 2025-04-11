/**
 * Format a number as a percentage string.
 * @param value Value to format, can be a number or a string.
 * @param fromDecimal Indicates if the value is in decimal format (e.g. 0.75). Defaults to false.
 * @returns string Formatted percentage string with two decimal places and a '%' sign.
 */
export const formatPercentage = (
  value: number | string,
  fromDecimal: boolean = false
): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return '';
  }

  const percentageValue = fromDecimal ? numericValue * 100 : numericValue;

  return `${percentageValue.toFixed(2)}%`;
};
