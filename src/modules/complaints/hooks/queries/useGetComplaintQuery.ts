import { COMPLAINTS_QUERY_KEY } from './useGetComplaintsQuery';
import { ComplaintsService } from '../../services';
import { useQuery } from '@tanstack/react-query';
import { Complaint } from '../../models';

export const useGetComplaintQuery = (complaintId: number) => {
  const getComplaintQuery = useQuery<Complaint>({
    queryKey: [COMPLAINTS_QUERY_KEY, 'actions', complaintId],
    queryFn: () =>
      ComplaintsService.getComplaint(complaintId),
    enabled: !!complaintId,
  });

  return {
    getComplaintQuery,
  };
};

