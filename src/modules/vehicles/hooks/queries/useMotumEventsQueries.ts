import { MotumEvent, MotumEventStatus } from '../../models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { VehicleServiceApi } from '../../services';
import toast from 'react-hot-toast';

interface Conf {
  status?: MotumEventStatus;
  startDate?: string;
  endDate?: string;
}

export const useMotumEventsQueries = (conf: Conf) => {
  const { status = 'pending', startDate, endDate } = conf;

  const queryClient = useQueryClient();

  const getMotumEventsQuery = useQuery({
    queryKey: ['motum-events', status, startDate, endDate],
    queryFn: () => VehicleServiceApi.getMotumEvents(status, startDate, endDate),
    staleTime: 1000 * 60 * 2,
  });

  const attendMotumEventMutation = useMutation({
    mutationFn: VehicleServiceApi.attendMotumEvent,
    onSuccess: (eventAttended) => {
      queryClient.invalidateQueries({
        queryKey: ['motum-events', 'attended', startDate, endDate],
      });
      queryClient.setQueryData<MotumEvent[]>(
        ['motum-events', 'pending', startDate, endDate],
        (prev) => prev?.filter((event) => event.id !== eventAttended.id),
      );
      toast.success(
        `Evento ${eventAttended.eventTypeName} atendido correctamente`,
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    getMotumEventsQuery,
    attendMotumEventMutation,
  };
};

