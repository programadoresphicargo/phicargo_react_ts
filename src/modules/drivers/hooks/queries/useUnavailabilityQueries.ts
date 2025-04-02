import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DriverUnavailabilityServiceApi } from '../../services';
import { DriverUnavailable } from '../../models';
import toast from 'react-hot-toast';

const driverUnavailabilitiesKey = 'driver-unavailabilities';

export const useUnavailabilityQueries = (driverId?: number) => {
  const queryClient = useQueryClient();

  const driverUnavailabilityQuery = useQuery<DriverUnavailable[]>({
    queryKey: [driverUnavailabilitiesKey, driverId],
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
      queryClient.setQueryData(
        [driverUnavailabilitiesKey, driverId],
        (prev?: DriverUnavailable[]) => (prev ? [newItem, ...prev] : [newItem]),
      );
      toast.success('Creado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const releaseDriverUnavailabilityMutation = useMutation({
    mutationFn: DriverUnavailabilityServiceApi.releaseDriverUnavailability,
    onSuccess: (newItem) => {
      queryClient.setQueryData(
        [driverUnavailabilitiesKey, driverId],
        (prev?: DriverUnavailable[]) =>
          prev?.map((item) => (item.id === newItem.id ? newItem : item)),
      );
      toast.success('Liberado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    driverUnavailabilityQuery,
    driverUnavailabilityMutation,
    releaseDriverUnavailabilityMutation,
  };
};
