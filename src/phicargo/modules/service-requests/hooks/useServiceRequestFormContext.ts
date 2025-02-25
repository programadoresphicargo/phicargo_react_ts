import { ServiceRequestFormContext } from '../context/ServiceRequestFormContext/ServiceRequestFormContext';
import { useContext } from 'react';

export const useServiceRequestFormContext = () => {
  const context = useContext(ServiceRequestFormContext);

  return context;
};

