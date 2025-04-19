import { Complaint } from '../../models';
import { ComplaintsService } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const COMPLAINTS_QUERY_KEY = 'complaints';

export const useGetComplaintsQuery = () => {
  const getComplaintsQuery = useQuery<Complaint[]>({
    queryKey: [COMPLAINTS_QUERY_KEY],
    queryFn: ComplaintsService.getComplaints,
  });

  return {
    getComplaintsQuery,
  };
};

