import { Dayjs } from 'dayjs';

interface RecordBase {
  date: Dayjs;
  simpleLoad: number;
  fullLoad: number;
  total: number;
  meta: number;
  difference: number;
  accumulatedDifference: number;
  availableUnits: number;
  unloadingUnits: number;
  longTripUnits: number;
  unitsInMaintenance: number;
  unitsNoOperator: number;
  totalUnits: number;
  observations: string;
}

export interface Record extends RecordBase {
  id: number;
  createdAt: Dayjs;
}

/**
 * Type para objetos con los campos a actualizar de un registro
 */
export type RecordUpdate = Partial<
  Pick<
    Record,
    | 'fullLoad'
    | 'simpleLoad'
    | 'longTripUnits'
    | 'unloadingUnits'
    | 'observations'
  >
>;
