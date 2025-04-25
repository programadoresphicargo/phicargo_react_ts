import type {
  Record,
  RecordComment,
  RecordCommentCreate,
  RecordComments,
  RecordUpdate,
} from '../models';
import type {
  RecordApi,
  RecordApiUpdate,
  RecordCommentApi,
  RecordCommentCreateApi,
} from '../models/api';

import dayjs from 'dayjs';

export class AvailibilityAdapter {
  static recordToLocal(record: RecordApi): Record {
    return {
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
      comments: AvailibilityAdapter.recordCommentsToLocal(record.comments),
      motorGenerators: record.motor_generators,
    };
  }

  static recordUpdateToApi(record: RecordUpdate): RecordApiUpdate {
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
  }

  static recordCommentsToLocal(comments: RecordCommentApi[]): RecordComments {
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
      unloading: unloading
        ? AvailibilityAdapter.recordCommentToLocal(unloading)
        : null,
      long: long ? AvailibilityAdapter.recordCommentToLocal(long) : null,
      noOperator: noOperator
        ? AvailibilityAdapter.recordCommentToLocal(noOperator)
        : null,
      simpleLoadLocals: simpleLoadLocals
        ? AvailibilityAdapter.recordCommentToLocal(simpleLoadLocals)
        : null,
      fullLoadLocals: fullLoadLocals
        ? AvailibilityAdapter.recordCommentToLocal(fullLoadLocals)
        : null,
    };
  }

  static recordCommentToLocal(comment: RecordCommentApi): RecordComment {
    return {
      id: comment.id,
      recordColumn: comment.record_column,
      comment: comment.comment,
    };
  }

  static recordCommentToApi(
    comment: RecordCommentCreate,
  ): RecordCommentCreateApi {
    return {
      record_column: comment.recordColumn,
      comment: comment.comment,
    };
  }
}

