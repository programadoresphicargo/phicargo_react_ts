import type { Contact } from '../../models';
import { ContactsService } from '../../services/contacts-service';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const contactsKey = 'contacts-key';

export const useGetContacts = (name: string) => {
  const contactsQuery = useQuery<Contact[]>({
    queryKey: [contactsKey, name],
    queryFn: () => ContactsService.getContacts(name),
    enabled: !!name,
  });

  const selection = useMemo(() => {
    return (contactsQuery.data || []).map((item) => ({
      label: item.name,
      id: item.id,
      name: item.name,
      street: item.street,
    }));
  }, [contactsQuery.data]);

  return {
    contactsQuery,
    selection,
    isLoading: contactsQuery.isFetching,
    contacts: contactsQuery.data || [],
    refetch: contactsQuery.refetch,
  };
};

