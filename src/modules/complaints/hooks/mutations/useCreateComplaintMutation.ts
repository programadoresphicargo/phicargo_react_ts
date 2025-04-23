import { useMutation, useQueryClient } from '@tanstack/react-query';

import { COMPLAINTS_QUERY_KEY } from '../queries';
import type { Complaint } from '../../models';
import { ComplaintsService } from '../../services';
import toast from 'react-hot-toast';

export const useCreateComplaintMutation = () => {
  const queryClient = useQueryClient();

  const createComplaintMutation = useMutation({
    mutationFn: ComplaintsService.createComplaint,
    onSuccess: (data) => {
      queryClient.setQueryData<Complaint[]>([COMPLAINTS_QUERY_KEY], (prev) =>
        prev ? [data, ...prev] : [data],
      );
      toast.success('Queja creada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createComplaintMutation,
  };
};

