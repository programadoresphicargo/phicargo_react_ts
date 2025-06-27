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

      const userAgent = navigator.userAgent || '';
      const isFlutterWebView = userAgent.includes('com.phicargo.admin');
      const storage = isFlutterWebView ? localStorage : sessionStorage;

      storage.setItem('session', JSON.stringify(session));
    },
    onError: (error: Error) => {
      setAuthStatus('unauthenticated');
      setSession(null);

      const userAgent = navigator.userAgent || '';
      const isFlutterWebView = userAgent.includes('com.phicargo.admin');
      const storage = isFlutterWebView ? localStorage : sessionStorage;

      storage.removeItem('session');
      toast.error(error.message);
    },
  });

  return {
    loginMutation,
  };
};