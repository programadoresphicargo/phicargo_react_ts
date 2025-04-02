import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Record } from '../models/record-model';
import RecordService from '../services/record-service';
import { editRecordComment } from '../utilities/edit-record-comment';
import toast from 'react-hot-toast';
import { useGlobalContext } from './useGlobalContext';

const mainKey = 'records';
const recordService = new RecordService();

/**
 * Custom hook para las queries de los registros
 * @returns Objeto con la query de los registros
 */
export const useRecords = () => {
  const queryClient = useQueryClient();
  const { month, branchId } = useGlobalContext();

  // const updateRecordMutation = useUpdateMutation<RecordUpdate, Record>({
  //   queryKey: [
  //     mainKey,
  //     month as unknown as string,
  //     branchId as unknown as string,
  //   ],
  //   mutationFn: recordService.editRecord,
  // });

  const updateRecordMutation = useMutation({
    mutationFn: recordService.editRecord,
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: [mainKey, month, branchId] });

      const previousItems = queryClient.getQueryData<Record[]>([mainKey, month, branchId]);

      queryClient.setQueryData([mainKey, month, branchId], (prevItems: Record[] | undefined) => {
        if (!prevItems) return [];

        return prevItems.map((i) =>
          i.id === item.id ? { ...i, ...item.updatedItem } : i,
        );
      });

      return { previousItems };
    },
    onSuccess: (updatedItems) => {
      queryClient.setQueryData([mainKey, month, branchId], (prevItems: Record[] | undefined) => {
        if (!prevItems) return [];

        return prevItems.map((i) => updatedItems.find((ui) => ui.id === i.id) || i);
      });
      toast.success('Registro actualizado con éxito');
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData([mainKey, month, branchId], context?.previousItems);
      toast.error(err.message || 'Error al actualizar el registro');
    },
  });

  const updateRecordDataMutation = useMutation({
    mutationFn: recordService.updateRecordDataById,
    onSuccess: (updatedItems) => {
      queryClient.setQueryData([mainKey, month, branchId], (prevItems: Record[] | undefined) => {
        if (!prevItems) return [];

        return prevItems.map((i) => updatedItems.find((ui) => ui.id === i.id) || i);
      });
      toast.success('Registro actualizado con éxito');
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
    },
  });

  return {
    updateRecordMutation,
    updateRecordDataMutation,
    editCommentMutation,
  };
};
