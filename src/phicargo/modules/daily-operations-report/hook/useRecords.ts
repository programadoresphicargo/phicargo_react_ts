import type { Record, RecordUpdate } from '../models/record-model';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import RecordService from '../services/record-service';
import { editRecordComment } from '../utilities/edit-record-comment';
import toast from 'react-hot-toast';
import { useGlobalContext } from './useGlobalContext';
import { useUpdateMutation } from './useUpdateMutation';

const mainKey = 'records';
const recordService = new RecordService();

/**
 * Custom hook para las queries de los registros
 * @returns Objeto con la query de los registros
 */
export const useRecords = () => {
  const queryClient = useQueryClient();
  const { month, branchId } = useGlobalContext();

  const updateRecordMutation = useUpdateMutation<RecordUpdate, Record>({
    queryKey: [
      mainKey,
      month as unknown as string,
      branchId as unknown as string,
    ],
    mutationFn: recordService.editRecord,
  });

  const updateRecordDataMutation = useMutation({
    mutationFn: recordService.updateRecordDataById,
    onSuccess: () => {
      toast.success('Registro actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: [mainKey, month, branchId] });
    },
    onError: (err) => {
      toast.error(err.message || 'Error al actualizar el registro');
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: recordService.editComment,
    onSuccess: (comment, { id }) => {
      queryClient.setQueryData([mainKey, month, branchId], (data: Record[]) => {
        return editRecordComment(data, id, comment);
      });
      toast.success('Comentario actualizado con éxito');
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  return {
    updateRecordMutation,
    updateRecordDataMutation,
    editCommentMutation
  };
};
