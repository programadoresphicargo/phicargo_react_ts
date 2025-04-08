import { WaybillService } from '../../services';
import type { WaybillTransportableProduct } from '../../models';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const waybillTransportableProductsKey = 'waybillTransportableProducts';

export const useGetTransportableProducts = () => {
  const waybillTransportableQuery = useQuery<WaybillTransportableProduct[]>({
    queryKey: [waybillTransportableProductsKey],
    queryFn: WaybillService.getTransportableProducts,
  });

  const selection = useMemo(() => {
    return (waybillTransportableQuery.data || []).map((item) => ({
      label: item.name,
      id: item.id,
    }));
  }, [waybillTransportableQuery.data]);

  return {
    waybillTransportableQuery,
    selection,
    isLoading: waybillTransportableQuery.isFetching,
    waybillTransportables: waybillTransportableQuery.data || [],
    refetch: waybillTransportableQuery.refetch,
  };
};

