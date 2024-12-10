import { useMutation, useQueryClient } from '@tanstack/react-query';

import AuthServiceApi from '../services/auth-service';
import toast from 'react-hot-toast';
import { useAuthContext } from './useAuthContext';
const { VITE_PHIDES_API_URL } = import.meta.env;

/**
 * Hook para realizar la mutación de login
 * @returns loginMutation
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  const { setAuthStatus, setSession } = useAuthContext();

  const sessionPhp = async (id: number) => {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID inválido');
      }

      const response = await fetch(`${VITE_PHIDES_API_URL}/login/inicio/validar2.php?id_usuario=${id}`);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
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
      toast.success('Actualizado con éxito');
      sessionPhp(session.user.id);
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

