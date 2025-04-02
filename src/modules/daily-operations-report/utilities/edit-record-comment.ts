import type { Record, RecordComment } from '../models/record-model';

/**
 * Function to edit a record comment
 * @param records Array of records from store
 * @param recordId Record id to edit
 * @param newComment New comment object to add or replace
 * @returns Record with the new comment
 */
export const editRecordComment = (
  records: Record[],
  recordId: number,
  newComment: RecordComment,
): Record[] => {
  const existingRecord = records.find((record) => record.id === recordId);
  if (!existingRecord) {
    throw new Error('Record not found');
  }

  switch (newComment.recordColumn) {
    case 'unloading':
      existingRecord.comments.unloading = newComment;
      break;
    case 'long':
      existingRecord.comments.long = newComment;
      break;
    case 'no_operator':
      existingRecord.comments.noOperator = newComment;
      break;
    case 'full_load_locals':
      existingRecord.comments.fullLoadLocals = newComment;
      break;
    case 'simple_load_locals':
      existingRecord.comments.simpleLoadLocals = newComment;
      break;
    default:
      throw new Error('Invalid record column');
  }

  return records.map((record) => record.id === recordId ? existingRecord : record);
};
