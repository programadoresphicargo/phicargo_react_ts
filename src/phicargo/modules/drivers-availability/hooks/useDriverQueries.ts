import { useMutation, useQuery } from "@tanstack/react-query";

import { Driver } from "../models/driver-model";
import DriverServiceApi from "../services/driver-service";
import toast from 'react-hot-toast';

const mainKey = 'drivers';

export const useDriverQueries = () => {


  const driversQuery = useQuery<Driver[]>({
    queryKey: [mainKey],
    queryFn: DriverServiceApi.getAllDrivers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const driverUpdateMutattion = useMutation({
    mutationFn: DriverServiceApi.updateDriver,
    onSuccess: () => {
      toast.success("Actualizado con éxito");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  })

  return {
    drivers: driversQuery.data || [],
    driversQuery,
    driverUpdateMutattion
  }
}
