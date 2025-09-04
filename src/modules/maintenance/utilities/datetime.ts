import 'dayjs/locale/es';

import dayjs, { Dayjs } from 'dayjs';

dayjs.locale('es');

const capitalizedDate = (date: string) => date.charAt(0).toUpperCase() + date.slice(1);

export const formatDate = (date: Dayjs) => {
  const formattedDate = date.format("MMMM D, YYYY HH:mm");
  return capitalizedDate(formattedDate);
}

