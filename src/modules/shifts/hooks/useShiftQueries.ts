import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Actividad, Shift } from '../models';
import ShiftServiceApi from '../services/shifts-service';
import toast from 'react-hot-toast';
import { useShiftsContext } from './useShiftsContext';

export const shiftKey = 'shifts';

export const useShiftQueries = (archivedDate?: string | null) => {

  const queryClient = useQueryClient();
  const { branchId } = useShiftsContext();

  const shiftQuery = useQuery<Shift[]>({
    queryKey: [shiftKey, 'all', branchId],
    queryFn: () => ShiftServiceApi.getShifts(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  const shiftAssignedQuery = useQuery<Shift[]>({
    queryKey: [shiftKey, 'assigned', branchId, archivedDate],
    queryFn: () => ShiftServiceApi.getShiftsAssigned(branchId, archivedDate),
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId && !!archivedDate,
  });

  const createShift = useMutation({
    mutationFn: ShiftServiceApi.createShift,
    onSuccess: (item) => {
      queryClient.setQueryData([shiftKey, branchId], (prev: Shift[]) =>
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
      queryClient.setQueryData([shiftKey, branchId], (prev: Shift[]) =>
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
    onSuccess: (newShifts) => {
      queryClient.setQueryData([shiftKey, branchId], () => newShifts || []);
      toast.success('Registro archivado');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const unarchiveShift = useMutation({
    mutationFn: ShiftServiceApi.unarchiveShift,
    onSuccess: (newShifts) => {
      queryClient.setQueryData([shiftKey, branchId], () => newShifts || []);
      toast.success('Registro desarchivado');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const actividadQuery = useQuery<Actividad[]>({
    queryKey: [shiftKey, 'actividad', branchId],
    queryFn: () => ShiftServiceApi.getActividad(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  return {
    shifts: shiftQuery.data || [],
    shiftsAssigned: shiftAssignedQuery.data || [],
    shiftQuery,
    shiftAssignedQuery,
    createShift,
    editShift,
    archiveShift,
    unarchiveShift,
    actividad: actividadQuery.data || [],
    actividadQuery
  };
};

