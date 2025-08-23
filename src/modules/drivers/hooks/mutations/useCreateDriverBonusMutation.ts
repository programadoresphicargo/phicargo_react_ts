import { DriverBonusService } from '../../services';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export const useCreateDriverBonusMutation = () => {
  const createDriverBonusMutation = useMutation({
    mutationFn: DriverBonusService.createDriverBonus,
    onSuccess: (data) => {
      if (data.status == 'success') {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    createDriverBonusMutation,
  };
};

