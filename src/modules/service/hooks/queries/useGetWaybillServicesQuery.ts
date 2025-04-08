import { WaybillService as Service } from '../../services';
import { WaybillService } from '../../models';
import { useQuery } from '@tanstack/react-query';

export const WAYBILL_SERVICES_QUERY_KEY = 'waybill-services';

export const useGetWaybillServicesQuery = (dateRange: [Date, Date] | null) => {
  const servicesQuery = useQuery<WaybillService[]>({
    queryKey: [WAYBILL_SERVICES_QUERY_KEY, dateRange],
    queryFn: () => Service.getWaybillServices(dateRange!),
    enabled: !!dateRange,
  });

  return {
    servicesQuery,
  };
};

