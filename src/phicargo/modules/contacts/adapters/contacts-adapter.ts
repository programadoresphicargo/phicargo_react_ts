import type { Contact } from '../models';
import type { ContactApi } from '../models/api';

export class ContactsAdapter {
  public static toContact(contact: ContactApi): Contact {
    return {
      id: contact.id,
      customer: contact.customer,
      supplier: contact.supplier,
      name: contact.name,
      street: contact.street,
    };
  }
}

