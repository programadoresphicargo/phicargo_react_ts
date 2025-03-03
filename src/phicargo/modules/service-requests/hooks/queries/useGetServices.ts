import { WaybillService } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const useGetServices = (dateRange: [Date, Date] | null) => {
  const servicesQuery = useQuery({
    queryKey: ['services-requests', dateRange],
    queryFn: () => WaybillService.getServiceRequests(dateRange!),
    enabled: !!dateRange,
  });

  return {
    servicesQuery,
  };
};

