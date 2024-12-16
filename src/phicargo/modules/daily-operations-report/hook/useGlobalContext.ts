import { GlobalContext } from '../context/GlobalContext';
import { useContext } from 'react';

/**
 * Custom hook para acceder al contexto global
 * @returns Contexto global
 */
export const useGlobalContext = () => {
  const globalContext = useContext(GlobalContext);

  return {
    ...globalContext,
  };
};
