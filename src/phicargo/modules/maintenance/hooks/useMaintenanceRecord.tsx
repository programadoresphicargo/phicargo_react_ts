import { MaintenanceRecord, MaintenanceRecordStatus } from '../models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import MaintenanceRecordServiceApi from '../services/maintenane-report-service';
import toast from 'react-hot-toast';

const mainKey = 'maintenance-records';

export const useMaintenanceRecord = (
  status: MaintenanceRecordStatus = 'pending',
) => {
  const queryClient = useQueryClient();

  const recordsQuery = useQuery<MaintenanceRecord[]>({
    queryKey: [mainKey, status],
    queryFn: () => MaintenanceRecordServiceApi.getAllRecords(status),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const addRecordMutation = useMutation({
    mutationFn: MaintenanceRecordServiceApi.addRecord,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [mainKey, status] });
    },
    onSuccess: (newRegister) => {
      queryClient.setQueryData(
        [mainKey, status],
        (prev: MaintenanceRecord[]) => [newRegister, ...prev],
      );
      toast.success('Registro creado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey, 'count'] });
    },
  });

  const editRecordMutation = useMutation({
    mutationFn: MaintenanceRecordServiceApi.editRecord,
    onSuccess: (newRecord) => {
      queryClient.setQueryData([mainKey, status], (prev: MaintenanceRecord[]) =>
        prev?.map((r) => (r.id === newRecord.id ? newRecord : r)),
      );
      toast.success('Registro actualizado correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar el registro');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey, 'count'] });
    },
  });

  const recordsCountQuery = useQuery({
    queryKey: [mainKey, 'count'],
    queryFn: () => MaintenanceRecordServiceApi.getRecordsCount(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const addRecordCommentMutation = useMutation({
    mutationFn: MaintenanceRecordServiceApi.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey], exact: false });
      toast.success('Comentario creado correctamente');
    },
    onError: () => {
      toast.error('Error al crear el comentario');
    },
  });

  return {
    records: recordsQuery.data || [],
    recordsQuery,
    addRecordMutation,
    addRecordCommentMutation,
    editRecordMutation,
    recordsCountQuery,
  };
};
