import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MotumEvent } from '../../models';
import { VehicleServiceApi } from '../../services';
import toast from 'react-hot-toast';

export const useMotumEventsQueries = () => {
  const queryClient = useQueryClient();

  const getMotumEventsQuery = useQuery({
    queryKey: ['motum-events'],
    queryFn: () => VehicleServiceApi.getMotumEvents(),
  });

  const attendMotumEventMutation = useMutation({
    mutationFn: VehicleServiceApi.attendMotumEvent,
    onSuccess: (eventAttended) => {
      queryClient.setQueryData<MotumEvent[]>(['motum-events'], (prev) =>
        prev?.filter((event) => event.id !== eventAttended.id),
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

