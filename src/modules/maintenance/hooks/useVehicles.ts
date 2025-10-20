import { VehicleInfo } from '../models';
import VehicleServiceApi from '../services/vehicle-service';
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";

const mainKey = 'vehicles';

export const useVehicles = (type: 'tractocamion' | 'remolques') => {

  const vehicleQuery = useQuery<VehicleInfo[]>({
    queryKey: [mainKey, type],
    queryFn: VehicleServiceApi.getVehicles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const VehicleSelectOptions = useMemo(() => {
    if (!vehicleQuery.data) return [];

    const filteredVehicles = vehicleQuery.data.filter(v => {
      if (type === 'tractocamion') {
        console.log(v.vehicle_type_id);
        return v.vehicle_type_id === 2162;
      } else if (type === 'remolques') {
        return v.vehicle_type_id !== 2162;
      }
      return true; 
    });

    console.log(filteredVehicles);
    return filteredVehicles.map(v => ({
      key: v.id,
      value: v.name,
    }));
  }, [vehicleQuery.data, type]);

  return {
    vehicleQuery,
    VehicleSelectOptions
  };
};
