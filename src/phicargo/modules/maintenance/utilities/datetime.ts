import 'dayjs/locale/es';

import dayjs, { Dayjs } from 'dayjs';

dayjs.locale('es');

const capitalizedDate = (date: string) => date.charAt(0).toUpperCase() + date.slice(1);

export const formatDate = (date: Dayjs) => {
  const formattedDate = date.format("MMMM D, YYYY HH:mm");
  return capitalizedDate(formattedDate);
}

export const daysUtilNow = (date: Dayjs) => {
  const now = dayjs();
  const diff =  Math.abs(now.diff(date, 'day'));
  return diff;
}

export const daysUtil = (date: Dayjs, date2: Dayjs) => {
  const diff = Math.abs(date.diff(date2, 'day'));
  return diff;
}

