import type { Contact } from '../models';
import ContactsServiceApi from '../services/contacts-service';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const mainKey = 'contacts';

interface Options {
  name?: string;
}

/**
 * Custom hook para los clientes
 * @returns Queries para los clientes
 */
export const useContacts = ({ name }: Options) => {
  const clientsQuery = useQuery<Contact[]>({
    queryKey: [mainKey, 'clients'],
    queryFn: ContactsServiceApi.getAllClients,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 20,
  });

  const providersQuery = useQuery<Contact[]>({
    queryKey: [mainKey, 'providers'],
    queryFn: ContactsServiceApi.getAllProviders,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 20,
  });

  const searchContactByNameQuery = useQuery<Contact[]>({
    queryKey: [mainKey, 'search-by-name', name],
    queryFn: () => ContactsServiceApi.searhContactByName(name!),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 20,
    enabled: !!name,
  });

  const ContactsSelection = useMemo(() => {
    return (searchContactByNameQuery.data || []).map((item) => ({
      value: item.name,
      key: item.id,
    }));
  }, [searchContactByNameQuery.data]);

  return {
    clientsQuery,
    providersQuery,
    searchContactByNameQuery,
    ContactsSelection,
  };
};

