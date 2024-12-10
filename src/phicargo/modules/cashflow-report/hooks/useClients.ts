import { Contact } from '../models';
import ContactsServiceApi from '../services/contacts-service';
import { useQuery } from '@tanstack/react-query';

const clientsKey = 'clients';

/**
 * Custom hook para los clientes
 * @returns Queries para los clientes
 */
export const useClients = () => {
  const clientsQuery = useQuery<Contact[]>({
    queryKey: [clientsKey],
    queryFn: ContactsServiceApi.getAllClients,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    clientsQuery,
  };
};
