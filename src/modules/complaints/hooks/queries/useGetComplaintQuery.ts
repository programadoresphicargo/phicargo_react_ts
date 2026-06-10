import { COMPLAINTS_QUERY_KEY } from './useGetComplaintsQuery';
import { ComplaintsService } from '../../services';
import { useQuery } from '@tanstack/react-query';
import { Complaint } from '../../models';

export const useGetComplaintQuery = (
  complaintId: number | null
) => {
  const getComplaintQuery = useQuery<Complaint>({
    queryKey: [COMPLAINTS_QUERY_KEY, 'complaint', complaintId],
    queryFn: () =>
      ComplaintsService.getComplaint(complaintId!),
    enabled: complaintId !== null,
  });

  return {
    getComplaintQuery,
  };
};

