import { VehicleInfo } from '../models';
import VehicleServiceApi from '../services/vehicle-service';
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";

const mainKey = 'vehicles';

export const useVehicles = () => {

  const vehicleQuery = useQuery<VehicleInfo[]>({
    queryKey: [mainKey],
    queryFn: VehicleServiceApi.getVehicles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const VehicleSelectOptions = useMemo(() => vehicleQuery.data?.map((v) => ({
    key: v.id,
    value: v.name,
  })) || [], [vehicleQuery.data]); 

  return {
    vehicleQuery,
    VehicleSelectOptions
  }
}