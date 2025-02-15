import { useDepartureAndArrivalQueries } from './useDepartureAndArrivalQueries';
import { useDriverStatsQueries } from './useDriverStatsQueries';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useTravelStatsQueries } from './useTravelStatsQueries';
import { useVehiclesStatsQueries } from './useVehiclesStatsQueries';
import { useWaybillStatsQueries } from './useWaybillStatsQueries';

export const useRefetchFn = () => {
  const { pathname } = useLocation();

  const { travelStatsQuery } = useTravelStatsQueries();
  const { vehiclesStatsQuery } = useVehiclesStatsQueries();
  const { driversStatsQuery } = useDriverStatsQueries();
  const { departureAndArrivalQuery } = useDepartureAndArrivalQueries();
  const { waybillStatsQuery } = useWaybillStatsQueries();

  const refetchFn = useMemo(() => {
    if (pathname.includes('/dashboards/operaciones')) {
      return travelStatsQuery.refetch;
    } else if (pathname.includes('/dashboards/unidades')) {
      return vehiclesStatsQuery.refetch;
    } else if (pathname.includes('/dashboards/operadores')) {
      return driversStatsQuery.refetch;
    } else if (pathname.includes('/dashboards/llegadas-tarde')) {
      return departureAndArrivalQuery.refetch;
    } else if (pathname.includes('/dashboards/finanzas')) {
      return waybillStatsQuery.refetch;
    } else {
      return () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return refetchFn;
};

