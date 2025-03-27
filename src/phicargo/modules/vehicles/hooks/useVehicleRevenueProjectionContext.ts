import VehicleRevenueProjectionContext from '../context/VehicleRevenuProjectionContext';
import { useContext } from 'react';

export const useVehicleRevenueProjectionContext = () => {
  const context = useContext(VehicleRevenueProjectionContext);

  return {
    ...context,
  };
};

