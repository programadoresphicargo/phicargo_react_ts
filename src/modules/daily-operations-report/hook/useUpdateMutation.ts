import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { UpdatableItem } from '@/types';
import toast from 'react-hot-toast';

interface ObjId {
  id: number;
}

interface UseUpdateMutationOptions<T, R extends ObjId> {
  queryKey: string[];
  mutationFn: MutationFunction<R, UpdatableItem<T>>;
}

/**
 * Custom hook para realizar una mutación de actualización
 * @template T - Tipo del objeto que se va a actualizar
 * @template R - Tipo del objeto que extiende de ObjId
 * @param {Object} options - Configuración para la mutación
 * @returns {Function} Mutación para actualizar un registro
 */
export const useUpdateMutation = <T, R extends ObjId>(
  options: UseUpdateMutationOptions<T, R>,
) => {
  const { queryKey, mutationFn } = options;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (item: UpdatableItem<T>) => {
      await queryClient.cancelQueries({ queryKey });

      const previousItems = queryClient.getQueryData<R[]>(queryKey);

      queryClient.setQueryData(queryKey, (prevItems: R[] | undefined) => {
        if (!prevItems) return [];

        return prevItems.map((i) =>
          i.id === item.id ? { ...i, ...item.updatedItem } : i,
        );
      });

      return { previousItems };
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(queryKey, (prevItems: R[] | undefined) => {
        if (!prevItems) return [];

        return prevItems.map((i) => (i.id === newItem.id ? newItem : i));
      });

      toast.success('Registro actualizado con éxito');
    },
    onError: (err, _newItem, context) => {
      queryClient.setQueryData(queryKey, context?.previousItems);
      toast.error(err.message || 'Error al actualizar el registro');
    },
  });
};
