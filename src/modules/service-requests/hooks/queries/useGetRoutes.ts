import type { Route } from '../../models';
import { WaybillService } from '../../services';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const routesKey = 'waybill-routes';

export const useGetRoutes = () => {
  const routesQuery = useQuery<Route[]>({
    queryKey: [routesKey],
    queryFn: WaybillService.getRoutes,
  });

  const selection = useMemo(() => {
    return (routesQuery.data || []).map((item) => ({
      label: item.name,
      id: item.id,
    }));
  }, [routesQuery.data]);

  return {
    routesQuery,
    selection,
    isLoading: routesQuery.isFetching,
    routes: routesQuery.data || [],
    refetch: routesQuery.refetch,
  };
};

