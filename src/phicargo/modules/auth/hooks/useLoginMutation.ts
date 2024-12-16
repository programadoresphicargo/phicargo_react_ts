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

  const startSession = async (userID: number) => {
    try {
      const response = await axios.post(
        `${VITE_PHIDES_API_URL}/login/inicio/start_session.php`,
        { userID: userID }, // Envía el userID en el cuerpo
        { withCredentials: true } // Habilita cookies y credenciales
      );

      if (response.data.success) {
        toast.success("Éxito: " + response.data.message);
      } else {
        toast.error("Error lógico: " + response.data.message);
      }
    } catch (error) {
      console.error("Error al iniciar la sesión:", error);
      toast.error("Error al comunicarse con el servidor.");
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
      startSession(session.user.id);
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

