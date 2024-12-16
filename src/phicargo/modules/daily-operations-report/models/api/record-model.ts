interface RecordApiBase {
  date: string;
  simple_load: number;
  full_load: number;
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
    | 'long_trip_units'
    | 'unloading_units'
    | 'observations'
  >
>;
