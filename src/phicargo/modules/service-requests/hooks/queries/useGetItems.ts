import type { WaybillItem } from '../../models';
import type { WaybillItemKey } from '../../types';
import { WaybillService } from '../../services';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useGetItems = (key: WaybillItemKey, searchTerm: string) => {
  const itemsQuery = useQuery<WaybillItem[]>({
    queryKey: [key, searchTerm],
    queryFn: () => WaybillService.getWaybillItems(key, searchTerm),
    enabled: !!searchTerm,
  });

  const selection = useMemo(() => {
    return (itemsQuery.data || []).map((item) => ({
      label: item.name,
      id: item.id,
      code: item.code,
    }));
  }, [itemsQuery.data]);

  return {
    itemsQuery,
    selection,
    isLoading: itemsQuery.isFetching,
    items: itemsQuery.data || [],
    refetch: itemsQuery.refetch,
  };
};

