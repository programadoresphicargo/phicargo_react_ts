import { useMutation, useQueryClient } from '@tanstack/react-query';

import { COMPLAINTS_QUERY_KEY } from '../queries';
import type { Complaint } from '../../models';
import { ComplaintsService } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateComplaintMutation = () => {
  const queryClient = useQueryClient();

  const updateComplaintMutation = useMutation({
    mutationFn: ComplaintsService.updateComplaint,
    onSuccess: (data) => {
      queryClient.setQueryData<Complaint[]>([COMPLAINTS_QUERY_KEY], (prev) =>
        prev?.map((c) => (c.id === data.id ? data : c)),
      );
      toast.success('Queja actualizada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    updateComplaintMutation,
  };
};

