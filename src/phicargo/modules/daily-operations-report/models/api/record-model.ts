import type { RecordColumnComment } from '../record-model';

interface RecordApiBase {
  record_date: string;
  simple_load: number;
  full_load: number;
  simple_load_locals: number;
  full_load_locals: number;
  total: number;
  meta: number;
  difference: number;
  accumulated_difference: number;
  available_units: number;
  unloading_units: number;
  long_trip_units: number;
  units_in_maintenance: number;
  units_no_operator: number;
  total_units: number;
  observations: string;
  comments: RecordCommentApi[];
}

export interface RecordApi extends RecordApiBase {
  id: number;
  created_at: string;
}

export type RecordApiCreate = RecordApiBase;

/**
 * Type para objetos con los campos a actualizar de un registro de la API
 */
export type RecordApiUpdate = Partial<
  Pick<
    RecordApi,
    | 'full_load'
    | 'simple_load'
    | 'simple_load_locals'
    | 'full_load_locals'
    | 'long_trip_units'
    | 'unloading_units'
    | 'observations'
  >
>;

interface RecordCommentBaseApi {
  record_column: RecordColumnComment;
  comment: string;
}

export interface RecordCommentApi extends RecordCommentBaseApi {
  id: number;
}

export type RecordCommentCreateApi = RecordCommentBaseApi;
