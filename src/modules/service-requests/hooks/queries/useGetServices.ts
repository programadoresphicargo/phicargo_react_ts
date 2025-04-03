import { WaybillService } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const SERVICE_REQUESTS_QUERY_KEY = 'services-requests';

export const useGetServices = (dateRange: [Date, Date] | null) => {
  const servicesQuery = useQuery({
    queryKey: [SERVICE_REQUESTS_QUERY_KEY, dateRange],
    queryFn: () => WaybillService.getServiceRequests(dateRange!),
    enabled: !!dateRange,
  });

  return {
    servicesQuery,
  };
};

