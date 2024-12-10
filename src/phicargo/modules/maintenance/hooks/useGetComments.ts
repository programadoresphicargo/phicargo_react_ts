import MaintenanceRecordServiceApi from '../services/maintenane-report-service';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'maintenance-records';

export const useGetComments = (registerId: number = 0) => {
  const commentsQuery = useQuery({
    queryKey: [mainKey, 'comments', registerId],
    queryFn: () =>
      MaintenanceRecordServiceApi.getCommentsByRecordId(registerId),
    enabled: registerId !== 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    commentsQuery,
  };
};
