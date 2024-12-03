import type { Permission, PermissionUser } from '../models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import PermissionsServiceApi from '../services/permissions-service';
import toast from 'react-hot-toast';

const mainKey = 'permssions';

interface Options {
  userId?: number;
}

export const usePermissionsQueries = ({ userId }: Options) => {
  const queryClient = useQueryClient();
  const permissionsQuery = useQuery<Permission[]>({
    queryKey: [mainKey],
    queryFn: PermissionsServiceApi.getAllPermissions,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const userPermissionsQuery = useQuery<PermissionUser[]>({
    queryKey: [mainKey, userId],
    queryFn: () => PermissionsServiceApi.getUserPermissions(userId!),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });

  const addUserPermissionsMutation = useMutation({
    mutationFn: PermissionsServiceApi.addPermissions,
    onSuccess: () => {
      toast.success('Permisos asignados con éxito');
      queryClient.invalidateQueries({ queryKey: [mainKey, userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  })

  return {
    permissionsQuery,
    userPermissionsQuery,
    addUserPermissionsMutation
  };
};

