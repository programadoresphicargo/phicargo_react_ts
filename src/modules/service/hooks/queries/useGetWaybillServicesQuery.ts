import { WaybillService } from '../../services';
import { useQuery } from '@tanstack/react-query';

export const WAYBILL_SERVICES_QUERY_KEY = 'waybill-services';

export const useGetWaybillServicesQuery = (dateRange: [Date, Date] | null) => {
  const servicesQuery = useQuery({
    queryKey: [WAYBILL_SERVICES_QUERY_KEY, dateRange],
    queryFn: () => WaybillService.getWaybillServices(dateRange!),
    enabled: !!dateRange,
  });

  return {
    servicesQuery,
  };
};

