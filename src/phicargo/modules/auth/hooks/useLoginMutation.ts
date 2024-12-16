import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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
      const response = await axios.post(
        `${VITE_PHIDES_API_URL}/login/inicio/validar2.php`, // Cambia a la URL de tu servidor
        { userID: id },
        { withCredentials: true } // Habilita las cookies para la sesión
      );

      if (response.data.status === "success") {
        toast.success(`Session created for userID: ${response.data.userID}`);
      } else {
        toast.error("Failed to create session.");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("An error occurred.");
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

