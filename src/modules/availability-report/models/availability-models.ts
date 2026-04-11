import { Dayjs } from 'dayjs';

interface RecordBase {
  date: Dayjs;
  simpleLoad: number;
  fullLoad: number;
  simpleLoadLocals: number;
  fullLoadLocals: number;
  total: number;
  meta: number;
  difference: number;
  accumulatedDifference: number;
  availableUnits: number;
  unloadingUnits: number;
  longTripUnits: number;
  unitsInMaintenance: number;
  unitsNoOperator: number;
  unitsNoOperatorDetail: string | null;
  operatorPermission: number;
  operatorPermissionDetail: string | null;
  totalUnits: number;
  observations: string;
  comments: RecordComments;
  motorGenerators: number;
  amountIncrease: number;
  amountDecrease: number;
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
    | 'simpleLoadLocals'
    | 'fullLoadLocals'
    | 'longTripUnits'
    | 'unloadingUnits'
    | 'observations'
    | 'motorGenerators'
    | 'amountIncrease'
    | 'amountDecrease'
  >
>;

export type RecordColumnComment =
  | 'unloading'
  | 'long'
  | 'no_operator'
  | 'simple_load_locals'
  | 'full_load_locals'
  | 'amount_increase'
  | 'amount_decrease'

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
  simpleLoadLocals: RecordComment | null;
  fullLoadLocals: RecordComment | null;
  amountDecrease: RecordComment | null;
  amountIncrease: RecordComment | null;
}
