import { COMPLAINTS_QUERY_KEY } from './useGetComplaintsQuery';
import { ComplaintsService } from '../../services';
import { useQuery } from '@tanstack/react-query';
import { CausaRaizBase } from '../../models/causa_raiz';

export const useGetComplaintCausaRaizQuery = (complaintId: number) => {
  const getComplaintCausaRaizQuery = useQuery<CausaRaizBase>({
    queryKey: [COMPLAINTS_QUERY_KEY, 'causa_raiz', complaintId],
    queryFn: () =>
      ComplaintsService.getComplaintCausaRaizByComplaint(complaintId),
    enabled: !!complaintId,

  });

  return {
    getComplaintCausaRaizQuery,
  };
};

