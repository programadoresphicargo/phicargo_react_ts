import type {
  Record,
  RecordComment,
  RecordCommentCreate,
  RecordComments,
  RecordUpdate,
} from '../models/record-model';
import type {
  RecordApi,
  RecordApiUpdate,
  RecordCommentApi,
  RecordCommentCreateApi,
} from '../models/api/record-model';

import dayjs from 'dayjs';

/**
 * Adaptador para convertir un registro de la API a un registro local
 * @param record Objeto con los datos de un registro
 * @returns Objeto con los datos de un registro
 */
export const recordToLocal = (record: RecordApi): Record => ({
  id: record.id,
  date: dayjs(record.record_date),
  simpleLoad: record.simple_load,
  fullLoad: record.full_load,
  simpleLoadLocals: record.simple_load_locals,
  fullLoadLocals: record.full_load_locals,
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
  comments: recordCommentsToLocal(record.comments),
});

/**
 * Adaptador para convertir los campos a actualizar de un registro local a un registro de la API
 * @param record Registro a actualizar
 * @returns Objeto con los campos a actualizar de un registro de la API
 */
export const recordUpdateToApi = (record: RecordUpdate): RecordApiUpdate => {
  const apiRecord: RecordApiUpdate = {};

  if (record.simpleLoad !== undefined) {
    apiRecord.simple_load = Number(record.simpleLoad);
  }

  if (record.fullLoad !== undefined) {
    apiRecord.full_load = Number(record.fullLoad);
  }

  if (record.simpleLoadLocals !== undefined) {
    apiRecord.simple_load_locals = Number(record.simpleLoadLocals);
  }

  if (record.fullLoadLocals !== undefined) {
    apiRecord.full_load_locals = Number(record.fullLoadLocals);
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

const recordCommentsToLocal = (
  comments: RecordCommentApi[],
): RecordComments => {
  const unloading = comments.filter(
    (comment) => comment.record_column === 'unloading',
  )[0];
  const long = comments.filter(
    (comment) => comment.record_column === 'long',
  )[0];
  const noOperator = comments.filter(
    (comment) => comment.record_column === 'no_operator',
  )[0];
  const simpleLoadLocals = comments.filter(
    (comment) => comment.record_column === 'simple_load_locals',
  )[0];
  const fullLoadLocals = comments.filter(
    (comment) => comment.record_column === 'full_load_locals',
  )[0];

  return {
    unloading: unloading ? recordCommentToLocal(unloading) : null,
    long: long ? recordCommentToLocal(long) : null,
    noOperator: noOperator ? recordCommentToLocal(noOperator) : null,
    simpleLoadLocals: simpleLoadLocals
      ? recordCommentToLocal(simpleLoadLocals)
      : null,
    fullLoadLocals: fullLoadLocals
      ? recordCommentToLocal(fullLoadLocals)
      : null,
  };
};

export const recordCommentToLocal = (
  comment: RecordCommentApi,
): RecordComment => ({
  id: comment.id,
  recordColumn: comment.record_column,
  comment: comment.comment,
});

/**
 * Mapper para convertir un comentario local a un comentario de la API
 * @param comment Comment with the data to create
 * @returns Comment with the data to create to send to the API
 */
export const recordCommentToApi = (
  comment: RecordCommentCreate,
): RecordCommentCreateApi => ({
  record_column: comment.recordColumn,
  comment: comment.comment,
});
