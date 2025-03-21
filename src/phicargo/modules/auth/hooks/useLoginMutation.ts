import { useMutation, useQueryClient } from '@tanstack/react-query';

import AuthServiceApi from '../services/auth-service';
import toast from 'react-hot-toast';
import { useAuthContext } from './useAuthContext';

/**
 * Hook para realizar la mutación de login
 * @returns loginMutation
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  const { setAuthStatus, setSession } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: AuthServiceApi.login,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['session'] });
    },
    onSuccess: (session) => {
      queryClient.setQueryData(['session'], session);
      setAuthStatus('authenticated');
      setSession(session);
      sessionStorage.setItem('session', JSON.stringify(session));
    },
    onError: (error: Error) => {
      setAuthStatus('unauthenticated');
      setSession(null);
      sessionStorage.removeItem('session');
      toast.error(error.message);
    },
  });

  return {
    loginMutation,
  };
};

