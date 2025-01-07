import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Shift } from '../models';
import ShiftServiceApi from '../services/shifts-service';
import toast from 'react-hot-toast';
import { useShiftsContext } from './useShiftsContext';

const mainKey = 'shifts';

export const useShiftQueries = () => {
  const queryClient = useQueryClient();
  const { branchId } = useShiftsContext();

  const shiftQuery = useQuery<Shift[]>({
    queryKey: [mainKey, branchId],
    queryFn: () => ShiftServiceApi.getShifts(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  const createShift = useMutation({
    mutationFn: ShiftServiceApi.createShift,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey, branchId], (prev: Shift[]) =>
        prev ? [...prev, item] : [item],
      );
      toast.success('Turno creado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const editShift = useMutation({
    mutationFn: ShiftServiceApi.editShift,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey, branchId], (prev: Shift[]) =>
        prev?.map((r) => (r.id === item.id ? item : r)),
      );
      toast.success('Registro actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const archiveShift = useMutation({
    mutationFn: ShiftServiceApi.archiveShift,
    onSuccess: (_item, variables) => {
      queryClient.setQueryData([mainKey, branchId], (prev: Shift[]) =>
        prev?.filter((r) => r.id !== variables.id),
      );
      toast.success('Registro archivado');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    shifts: shiftQuery.data || [],
    shiftQuery,
    createShift,
    editShift,
    archiveShift,
  };
};

