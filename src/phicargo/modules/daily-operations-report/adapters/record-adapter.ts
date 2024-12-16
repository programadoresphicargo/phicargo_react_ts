import type { Record, RecordUpdate } from '../models/record-model';
import type { RecordApi, RecordApiUpdate } from '../models/api/record-model';

import dayjs from 'dayjs';

/**
 * Adaptador para convertir un registro de la API a un registro local
 * @param record Objeto con los datos de un registro
 * @returns Objeto con los datos de un registro
 */
export const recordToLocal = (record: RecordApi): Record => ({
  id: record.id,
  date: dayjs(record.date),
  simpleLoad: record.simple_load,
  fullLoad: record.full_load,
  total: record.total,
  meta: record.meta,
  difference: record.difference,
  accumulatedDifference: record.accumulated_difference,
  availableUnits: record.available_units,
  unloadingUnits: record.unloading_units,
  longTripUnits: record.long_trip_units,
  unitsInMaintenance: record.units_in_maintenance,
  unitsNoOperator: record.units_no_operator,
  totalUnits: record.total_units,
  observations: record.observations,
  createdAt: dayjs(record.created_at),
});

/**
 * Adaptador para convertir los campos a actualizar de un registro local a un registro de la API
 * @param record Registro a actualizar
 * @returns Objeto con los campos a actualizar de un registro de la API
 */
export const recordUpdateToApi = (record: RecordUpdate): RecordApiUpdate => {
  const apiRecord: RecordApiUpdate = {};

  if (record.simpleLoad) {
    apiRecord.simple_load = Number(record.simpleLoad);
  }

  if (record.fullLoad) {
    apiRecord.full_load = Number(record.fullLoad);
  }

  if (record.unloadingUnits) {
    apiRecord.unloading_units = Number(record.unloadingUnits);
  }

  if (record.longTripUnits) {
    apiRecord.long_trip_units = Number(record.longTripUnits);
  }

  if (record.observations) {
    apiRecord.observations = record.observations;
  }

  return apiRecord;
};
