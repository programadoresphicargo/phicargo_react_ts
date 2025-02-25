import type { WaybillCategory } from '../../models';
import { WaybillService } from '../../services';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const waybillKey = 'waybillCategory';

export const useGetWaybillCategory = () => {
  const waybillCategoryQuery = useQuery<WaybillCategory[]>({
    queryKey: [waybillKey],
    queryFn: WaybillService.getCategories,
  });

  const selection = useMemo(() => {
    return (waybillCategoryQuery.data || []).map((item) => ({
      label: item.name,
      id: item.id,
    }));
  }, [waybillCategoryQuery.data]);

  return {
    waybillCategoryQuery,
    selection,
    isLoading: waybillCategoryQuery.isFetching,
    waybillCategories: waybillCategoryQuery.data || [],
    refetch: waybillCategoryQuery.refetch,
  };
};

