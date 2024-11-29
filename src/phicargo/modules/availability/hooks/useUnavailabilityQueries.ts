import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import DriverUnavailabilityServiceApi from '../services/driver-unavailability-service';
import type { DriverUnavailable } from '../models/driver-unavailability';
import toast from 'react-hot-toast';

interface Options {
  driverId?: number;
}

const mainKey = 'driver-unavailability';

export const useUnavailabilityQueries = (options: Options) => {
  const queryClient = useQueryClient();

  const { driverId } = options;

  const driverUnavailabilityQuery = useQuery<DriverUnavailable[]>({
    queryKey: [mainKey],
    queryFn: () =>
      DriverUnavailabilityServiceApi.getDriverUnavailabilitiesById(
        driverId as number,
      ),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!driverId,
  });

  const driverUnavailabilityMutation = useMutation({
    mutationFn: DriverUnavailabilityServiceApi.createDriverUnavailability,
    onSuccess: (newItem) => {
      queryClient.setQueryData([mainKey], (prev?: DriverUnavailable[]) =>
        prev ? [newItem, ...prev] : [newItem],
      );
      toast.success('Creado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    driverUnavailabilityQuery,
    driverUnavailabilityMutation,
  };
};
