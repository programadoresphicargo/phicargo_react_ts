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
  comments: RecordComments;
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


export type RecordColumnComment = 'unloading' | 'long' | 'no_operator';

interface RecordCommentBase {
  recordColumn: RecordColumnComment;
  comment: string;
}

export interface RecordComment extends RecordCommentBase {
  id: number;
}

export type RecordCommentCreate = RecordCommentBase;

export interface RecordComments {
  unloading: RecordComment | null;
  long: RecordComment | null;
  noOperator: RecordComment | null;
}
