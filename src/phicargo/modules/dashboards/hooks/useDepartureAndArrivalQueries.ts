import { DepartureAndArrivalService } from '../services/departure-and-arrival-service';
import type { DepartureAndArrivalStats } from '../models/departure-and-arrival-models';
import { useDateRangeContext } from './useDateRangeContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const departureAndArrivalKey = 'departureAndArrivalStats';

export const useDepartureAndArrivalQueries = () => {
  const { monthString } = useDateRangeContext();
  const { pathname } = useLocation();

  const departureAndArrivalQuery = useQuery<DepartureAndArrivalStats>({
    queryKey: [departureAndArrivalKey, monthString?.start, monthString?.end],
    queryFn: () =>
      DepartureAndArrivalService.getDepartureAndArrivalStats(
        monthString!.start,
        monthString!.end,
      ),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    enabled: !!monthString && pathname === '/dashboards/llegadas-tarde',
  });

  return {
    departureAndArrivalQuery,
  };
};

