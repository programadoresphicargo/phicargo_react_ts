export const getMonthName = (monthNumber: number, short: boolean = false) => {
  if (monthNumber < 1 || monthNumber > 12) {
    return 'Mes inválido';
  }

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const shortMonthNames = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
  ];

  if (short) {
    return shortMonthNames[monthNumber - 1];
  }

  return monthNames[monthNumber - 1];
};

