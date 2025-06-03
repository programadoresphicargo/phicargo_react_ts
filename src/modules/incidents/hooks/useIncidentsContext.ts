import { useContext } from 'react';
import IncidentsContext from '../context/IncidentsContext';

export const useIncidentsContext = () => {
  const context = useContext(IncidentsContext);

  return {
    ...context,
  };
};

