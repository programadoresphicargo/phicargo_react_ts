import { COMPLAINTS_QUERY_KEY } from './useGetComplaintsQuery';
import type { ComplaintAction } from '../../models';
import { ComplaintsService } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const useGetAllComplaintActionsQuery = () => {
  const getAllComplaintActionsQuery = useQuery<ComplaintAction[]>({
    queryKey: [COMPLAINTS_QUERY_KEY, 'all_actions'],
    queryFn: () => ComplaintsService.getComplaintActions(),
  });

  return {
    getAllComplaintActionsQuery,
  };
};

