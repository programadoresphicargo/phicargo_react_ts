import { DayOffService } from '../../services/day-off-service';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export const useCreateDayOffMutation = () => {
  const createDayOffMutation = useMutation({
    mutationFn: DayOffService.createDayOff,
    onSuccess: () => {
      toast.success(`Día inhábil creado con éxito`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createDayOffMutation };
};

