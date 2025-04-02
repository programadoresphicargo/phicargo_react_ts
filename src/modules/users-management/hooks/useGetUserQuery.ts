import type { FullUser } from '../../auth/models';
import UsersServiceApi from '../services/users-service';
import { useQuery } from '@tanstack/react-query';

export const useGetUserQuery = (userId: number) => {
  const usersQuery = useQuery<FullUser>({
    queryKey: ['users-management', userId],
    queryFn: () => UsersServiceApi.getUserInfo(userId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });

  return usersQuery;
};

