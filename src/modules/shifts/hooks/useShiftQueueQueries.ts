import type { Queue, Shift } from '../models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ShiftServiceApi from '../services/shifts-service';
import toast from 'react-hot-toast';
import { useShiftsContext } from './useShiftsContext';

const shiftKey = 'shifts';
const mainKey = 'shifts-queue';

export const useShiftQueueQueries = () => {
  const queryClient = useQueryClient();
  const { branchId } = useShiftsContext();

  const queuesQuery = useQuery<Queue[]>({
    queryKey: [mainKey, branchId],
    queryFn: () => ShiftServiceApi.getAllQueues(branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!branchId,
  });

  const createQueue = useMutation({
    mutationFn: ShiftServiceApi.createShiftQueue,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey, branchId], (prev: Queue[]) =>
        prev ? [...prev, item] : [item],
      );
      queryClient.setQueryData([shiftKey, branchId], (prev: Shift[]) =>
        prev?.filter((r) => r.id !== item.shift.id),
      );
      toast.success('Turno creado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const releaseQueue = useMutation({
    mutationFn: ShiftServiceApi.releaseQueue,
    onSuccess: (_item, queueId) => {
      queryClient.setQueryData([mainKey, branchId], (prev: Queue[]) =>
        prev?.filter((r) => r.id !== queueId),
      );
      queryClient.invalidateQueries({ queryKey: [shiftKey, branchId] });
      toast.success('Turno liberado correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    queuesQuery,
    createQueue,
    releaseQueue,
  };
};

