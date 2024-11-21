import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Driver } from "../models/driver-model";
import DriverServiceApi from "../services/driver-service";

const mainKey = 'drivers';

export const useDriverQueries = () => {

  const driversQuery = useQuery<Driver[]>({
    queryKey: [mainKey],
    queryFn: DriverServiceApi.getAllDrivers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData<Driver[]>,
  });

  return {
    drivers: driversQuery.data || [],
    driversQuery,
  }
}
