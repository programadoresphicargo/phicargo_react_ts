import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Driver } from '../models/driver-model';
import DriverServiceApi from '../services/driver-service';
import { SelectItem } from '@/types';
import toast from 'react-hot-toast';
import { useMemo } from 'react';

const mainKey = 'drivers';

export const useDriverQueries = () => {
  const queryClient = useQueryClient();
  const driversQuery = useQuery<Driver[]>({
    queryKey: [mainKey],
    queryFn: DriverServiceApi.getAllDrivers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const driverUpdateMutattion = useMutation({
    mutationFn: DriverServiceApi.updateDriver,
    onSuccess: (item) => {
      queryClient.setQueryData([mainKey], (prev?: Driver[]) =>
        prev?.map((d) => (d.id === item.id ? item : d)),
      );
      toast.success('Actualizado con éxito');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const AvailableDrivers = useMemo<SelectItem[]>(() => {
    return (driversQuery.data || [])
      .map((d) => ({
        key: d.id,
        value: d.name,
      }));
  }, [driversQuery.data]);

  return {
    drivers: driversQuery.data || [],
    AvailableDrivers,
    driversQuery,
    driverUpdateMutattion,
  };
};
