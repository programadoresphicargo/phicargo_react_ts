
/**
 * Formatea un valor numérico como moneda
 * @param value Valor a formatear
 * @returns string Valor formateado como moneda
 */
export const formatCurrency = (value: number | string): string => {

  // Convertir el valor a número si es una cadena
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Verificar si la conversión fue exitosa
  if (isNaN(numericValue)) {
    return ''; // O un mensaje de error si prefieres
  }

  return numericValue.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2, // Mostrar siempre 2 decimales
    maximumFractionDigits: 2, // No más de 2 decimales
  });
};

