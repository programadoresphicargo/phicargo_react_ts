import { useMutation, useQueryClient } from '@tanstack/react-query';

import { COMPLAINTS_QUERY_KEY } from '../queries';
import type { ComplaintAction } from '../../models';
import { ComplaintsService } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateComplaintActionMutation = () => {
  const queryClient = useQueryClient();

  const updateComplaintActionMutation = useMutation({
    mutationFn: ComplaintsService.updateComplaintAction,
    onSuccess: (data) => {
      queryClient.setQueryData<ComplaintAction[]>(
        [COMPLAINTS_QUERY_KEY, 'actions', data.complaintId],
        (prev) =>
          prev?.map((action) => (action.id === data.id ? data : action)),
      );
      toast.success('Acción actualizada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    updateComplaintActionMutation,
  };
};

