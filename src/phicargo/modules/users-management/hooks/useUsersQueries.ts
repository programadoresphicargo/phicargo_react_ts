import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { User } from '../../auth/models';
import UsersServiceApi from '../services/users-service';
import toast from 'react-hot-toast';

const mainKey = 'users-management';

export const useUsersQueries = () => {
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>({
    queryKey: [mainKey],
    queryFn: UsersServiceApi.getAllUsers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const userCreateMutation = useMutation({
    mutationFn: UsersServiceApi.createUser,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey], (prev?: User[]) =>
        prev ? [ item,...prev ] : [item],
      );
      toast.success('Creado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const userUpdateMutattion = useMutation({
    mutationFn: UsersServiceApi.updateUser,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey], (prev?: User[]) =>
        prev?.map((d) => (d.id === item.id ? item : d)),
      );
      queryClient.invalidateQueries({ queryKey: [mainKey, item.id] })
      toast.success('Actualizado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    users: usersQuery.data || [],
    usersQuery,
    userUpdateMutattion,
    userCreateMutation,
  };
};

