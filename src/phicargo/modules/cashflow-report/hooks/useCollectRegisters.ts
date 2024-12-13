import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CollectRegister } from '../models';
import CollectServiceApi from '../services/collect-service';
import { getDefaultCollectRegister } from '../utils';
import toast from 'react-hot-toast';
import { useWeekContext } from './useWeekContext';

const registersKey = 'registers';

/**
 * Custom hook para los registros de cobro
 * @returns Queries y mutaciones para los registros de cobro
 */
export const useCollectRegisters = () => {
  const queryClient = useQueryClient();

  const { activeWeekId, companySelected } = useWeekContext();

  const collectRegisterQuery = useQuery({
    queryKey: [registersKey, 'weekId', activeWeekId, 'company', companySelected],
    queryFn: () =>
      CollectServiceApi.getCollectRegisterByWeekId(activeWeekId || 0, companySelected),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!activeWeekId && !!companySelected,
  });

  const createCollectRegisterMutation = useMutation({
    mutationFn: CollectServiceApi.createRegister,
    onMutate: async (newRegister) => {
      await queryClient.cancelQueries({
        queryKey: [registersKey, 'weekId', activeWeekId, 'company', companySelected],
      });
      const previousRegisters = queryClient.getQueryData<CollectRegister[]>([
        registersKey,
        'weekId',
        activeWeekId,
      ]);
      const tempId = Math.random() + 1;
      queryClient.setQueryData<CollectRegister[]>(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        (prev) => [
          { ...getDefaultCollectRegister(tempId, newRegister) },
          ...(prev || []),
        ],
      );
      return { previousRegisters, tempId };
    },
    onSuccess: (newRegister, _variables, context) => {
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        (prev: CollectRegister[]) =>
          prev?.map((r) => (r.id === context.tempId ? newRegister : r)),
      );
      toast.success('Registro creado correctamente');
    },
    onError: (err, _newRegister, context) => {
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        context?.previousRegisters,
      );
      toast.error(err.message);
    },
  });

  const updateCollectRegisterMutation = useMutation({
    mutationFn: CollectServiceApi.updateRegister,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [registersKey, 'weekId', activeWeekId, 'company', companySelected],
      });
      const previousRegisters = queryClient.getQueryData<CollectRegister[]>([
        registersKey,
        'weekId',
        activeWeekId,
      ]);
      return { previousRegisters };
    },
    onSuccess: (newRegister) => {
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        (prev: CollectRegister[]) =>
          prev?.map((r) => (r.id === newRegister.id ? newRegister : r)),
      );
      toast.success('Registro actualizado correctamente');
    },
    onError: (err, _newRegister, context) => {
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        context?.previousRegisters,
      );
      toast.error(err.message);
    },
  });

  const deleteCollectRegisterMutation = useMutation({
    mutationFn: CollectServiceApi.deleteRegister,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: [registersKey, 'weekId', activeWeekId, 'company', companySelected],
      });
      const previousRegisters = queryClient.getQueryData<CollectRegister[]>([
        registersKey,
        'weekId',
        activeWeekId,
      ]);
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        (prev: CollectRegister[]) => prev?.filter((r) => r.id !== id),
      );
      return { previousRegisters };
    },
    onSuccess: () => {
      toast.success('Registro eliminado correctamente');
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        context?.previousRegisters,
      );
      toast.error(err.message);
    },
  });

  const confirmCollectMutation = useMutation({
    mutationFn: CollectServiceApi.confirmCollect,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [registersKey, 'weekId', activeWeekId, 'company', companySelected],
      });
      const previousRegisters = queryClient.getQueryData<CollectRegister[]>([
        registersKey,
        'weekId',
        activeWeekId,
      ]);
      return { previousRegisters };
    },
    onSuccess: (newRegister) => {
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        (prev: CollectRegister[]) =>
          prev?.map((r) => (r.id === newRegister.id ? newRegister : r)),
      );
      toast.success('Monto confirmado correctamente');
    },
    onError: (err, _newRegister, context) => {
      queryClient.setQueryData(
        [registersKey, 'weekId', activeWeekId, 'company', companySelected],
        context?.previousRegisters,
      );
      toast.error(err.message);
    },
  });

  const loadPreviousWeekCollects = useMutation({
    mutationFn: CollectServiceApi.loadPreviousWeek,
    onSuccess: () => {
      toast.success('Pagos sin confirmar cargados correctamente');
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [registersKey, 'weekId', activeWeekId, 'company', companySelected],
      });
    },
  });

  return {
    collects: collectRegisterQuery.data || [],
    collectRegisterQuery,
    createCollectRegisterMutation,
    updateCollectRegisterMutation,
    deleteCollectRegisterMutation,
    confirmCollectMutation,
    loadPreviousWeekCollects,
  };
};
