import CreateServiceContext from '../context/CreateServiceContext/CreateServiceContext';
import { useContext } from 'react';

export const useCreateServiceContext = () => {
  const context = useContext(CreateServiceContext);

  return {
    ...context,
  };
};

