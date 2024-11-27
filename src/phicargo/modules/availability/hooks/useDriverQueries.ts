import { Driver, DriverSimple2 } from '../models/driver-model';
import { useMutation, useQuery } from '@tanstack/react-query';

import DriverServiceApi from '../services/driver-service';
import toast from 'react-hot-toast';

const mainKey = 'drivers';

export const useDriverQueries = () => {
  const driversQuery = useQuery<Driver[]>({
    queryKey: [mainKey],
    queryFn: DriverServiceApi.getAllDrivers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const allDriversQuery = useQuery<DriverSimple2[]>({
    queryKey: [mainKey, 'all'],
    queryFn: DriverServiceApi.getDrivers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const driverUpdateMutattion = useMutation({
    mutationFn: DriverServiceApi.updateDriver,
    onSuccess: () => {
      toast.success('Actualizado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    drivers: driversQuery.data || [],
    driversQuery,
    driverUpdateMutattion,
    allDriversQuery,
  };
};
