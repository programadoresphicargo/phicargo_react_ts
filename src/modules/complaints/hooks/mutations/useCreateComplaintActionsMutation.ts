import { useMutation, useQueryClient } from '@tanstack/react-query';

import { COMPLAINTS_QUERY_KEY } from '../queries';
import type { ComplaintAction } from '../../models';
import { ComplaintsService } from '../../services';
import toast from 'react-hot-toast';

export const useCreateComplaintActionsMutation = () => {
  const queryClient = useQueryClient();

  const createComplaintActionaMutation = useMutation({
    mutationFn: ComplaintsService.createComplaintActions,
    onSuccess: (data) => {
      if (data && data.length === 0) return;
      const complaintId = data[0].complaintId;
      queryClient.setQueryData<ComplaintAction[]>(
        [COMPLAINTS_QUERY_KEY, 'actions', complaintId],
        (prev) => [...(prev || []), ...data],
      );
      toast.success('Acción actualizada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createComplaintActionaMutation,
  };
};
