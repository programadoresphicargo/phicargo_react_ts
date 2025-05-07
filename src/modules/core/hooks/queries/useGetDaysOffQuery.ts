import { useQuery } from '@tanstack/react-query';
import { DayOffService } from '../../services/day-off-service';

interface Options {
  startDate: string;
  endDate: string;
}

export const useGetDaysOffQuery = ({ endDate, startDate }: Options) => {
  const getDaysOffQuery = useQuery({
    queryKey: ['days-off', startDate, endDate],
    queryFn: () => DayOffService.getDaysOff(startDate, endDate),
  });

  return {
    getDaysOffQuery,
  };
};

