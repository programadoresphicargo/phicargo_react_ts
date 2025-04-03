import { DriverBonusService } from '../../services';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export const useCreateDriverBonusMutation = () => {
  const createDriverBonusMutation = useMutation({
    mutationFn: DriverBonusService.createDriverBonus,
    onSuccess: () => {
      toast.success('Bonos creados correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    createDriverBonusMutation,
  };
};

