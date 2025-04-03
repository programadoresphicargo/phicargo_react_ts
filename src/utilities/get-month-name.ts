export const getMonthName = (monthNumber: number) => {
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
  return monthNames[monthNumber - 1];
};

