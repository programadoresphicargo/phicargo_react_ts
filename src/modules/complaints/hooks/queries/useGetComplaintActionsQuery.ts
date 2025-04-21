import { COMPLAINTS_QUERY_KEY } from './useGetComplaintsQuery';
import type { ComplaintAction } from '../../models';
import { ComplaintsService } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const useGetComplaintActionsQuery = (complaintId: number) => {
  const getComplaintActionsQuery = useQuery<ComplaintAction[]>({
    queryKey: [COMPLAINTS_QUERY_KEY, 'actions', complaintId],
    queryFn: () =>
      ComplaintsService.getComplaintActionsByComplaint(complaintId),
    enabled: !!complaintId,
  });

  return {
    getComplaintActionsQuery,
  };
};

