import type { Record } from '../models/record-model';
import dayjs from 'dayjs';

/**
 * Obtiene el registro de hoy
 * @param records Registros
 * @returns Registro de hoy
 */
export const getTodayRecord = (records: Record[]) => {
  return records.find((record) => record.date.isSame(dayjs(), 'day'));
};
