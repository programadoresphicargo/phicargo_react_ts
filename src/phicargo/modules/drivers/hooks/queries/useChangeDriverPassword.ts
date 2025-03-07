import { DriverService } from '../../services';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export const useChangeDriverPassword = () => {
  const changeDriverPasswordMutation = useMutation({
    mutationFn: DriverService.changeDriverPassword,
    onSuccess: () => {
      toast.success('Contraseña cambiada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { changeDriverPasswordMutation };
};

