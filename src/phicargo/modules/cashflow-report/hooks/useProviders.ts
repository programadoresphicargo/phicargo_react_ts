import type { Contact } from '../models';
import ContactsServiceApi from '../services/contacts-service';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'providers';

/**
 * Custom hook para manejar los proveedores
 * @returns Objeto con queries y mutaciones para los proveedores
 */
export const useProviders = () => {
  const providersQuery = useQuery<Contact[]>({
    queryKey: [mainKey],
    queryFn: ContactsServiceApi.getAllProviders,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    providersQuery,
  };
};
