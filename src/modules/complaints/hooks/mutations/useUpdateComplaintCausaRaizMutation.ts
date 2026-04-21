import { useMutation } from '@tanstack/react-query';
import { ComplaintsService } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateComplaintCausaRaizMutation = () => {

  const updateComplaintCausaRaizMutation = useMutation({
    mutationFn: ComplaintsService.updateComplaintCausaRaiz,
    onSuccess: () => {
      toast.success('Causa raiz actualizada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    updateComplaintCausaRaizMutation,
  };
};
