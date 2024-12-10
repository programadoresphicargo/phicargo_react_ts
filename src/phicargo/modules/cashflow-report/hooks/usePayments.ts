import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Payment } from '../models';
import PaymentServiceApi from '../services/payments-service';
import { getDefaultPayment } from '../utils';
import toast from 'react-hot-toast';
import { useWeekContext } from './useWeekContext';

const mainKey = 'payments';

/**
 * Custom hook para manejar los pagos
 * @returns Objeto con queries y mutaciones para los pagos
 */
export const usePayments = () => {
  const queryClient = useQueryClient();

  const { activeWeekId } = useWeekContext();

  const paymentsQuery = useQuery({
    queryKey: [mainKey, 'weekId', activeWeekId],
    queryFn: () => PaymentServiceApi.getRegisterByWeekId(activeWeekId || 6),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!activeWeekId,
  });

  const createPaymentMutation = useMutation({
    mutationFn: PaymentServiceApi.createRegister,
    onMutate(newPayment) {
      queryClient.cancelQueries({
        queryKey: [mainKey, 'weekId', activeWeekId],
      });
      const previousPayments = queryClient.getQueryData([
        mainKey,
        'weekId',
        activeWeekId,
      ]);
      const tempId = Math.random() + 1;
      queryClient.setQueryData<Payment[]>(
        [mainKey, 'weekId', activeWeekId],
        (prev) => [
          { ...getDefaultPayment(tempId, newPayment) },
          ...(prev || []),
        ],
      );
      return { previousPayments, tempId };
    },
    onSuccess: (newRegister, _variables, context) => {
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        (prev: Payment[]) =>
          prev?.map((r) => (r.id === context.tempId ? newRegister : r)),
      );
      toast.success('Registro creado correctamente');
    },
    onError: (err, _newRegister, context) => {
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        context?.previousPayments,
      );
      toast.error(err.message);
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: PaymentServiceApi.updateRegister,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [mainKey, 'weekId', activeWeekId],
      });
      const previousPayments = queryClient.getQueryData([
        mainKey,
        'weekId',
        activeWeekId,
      ]);
      return { previousPayments };
    },
    onSuccess: (newRegister) => {
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        (prev: Payment[]) =>
          prev?.map((r) => (r.id === newRegister.id ? newRegister : r)),
      );
      toast.success('Registro actualizado correctamente');
    },
    onError: (err, _newRegister, context) => {
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        context?.previousPayments,
      );
      toast.error(err.message);
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: PaymentServiceApi.deleteRegister,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: [mainKey, 'weekId', activeWeekId],
      });
      const previousPayments = queryClient.getQueryData([
        mainKey,
        'weekId',
        activeWeekId,
      ]);
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        (prev: Payment[]) => prev?.filter((r) => r.id !== id),
      );
      return { previousPayments };
    },
    onSuccess: () => {
      toast.success('Registro eliminado correctamente');
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        context?.previousPayments,
      );
      toast.error(err.message);
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: PaymentServiceApi.confirmPayment,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [mainKey, 'weekId', activeWeekId],
      });
      const previousPayments = queryClient.getQueryData([
        mainKey,
        'weekId',
        activeWeekId,
      ]);
      return { previousPayments };
    },
    onSuccess: (newRegister) => {
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        (prev: Payment[]) =>
          prev?.map((r) => (r.id === newRegister.id ? newRegister : r)),
      );
      toast.success('Pago confirmado');
    },
    onError: (err, _newRegister, context) => {
      queryClient.setQueryData(
        [mainKey, 'weekId', activeWeekId],
        context?.previousPayments,
      );
      toast.error(err.message);
    },
  });

  const loadPreviousWeekPayments = useMutation({
    mutationFn: PaymentServiceApi.loadPreviousWeek,
    onSuccess: () => {
      toast.success('Pagos sin confirmar cargados correctamente');
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [mainKey, 'weekId', activeWeekId],
      });
    },
  });

  return {
    paymentsQuery,
    createPaymentMutation,
    updatePaymentMutation,
    deletePaymentMutation,
    confirmPaymentMutation,
    loadPreviousWeekPayments,
  };
};
