import type { ServiceRequestCreate } from '../../models';
import type { UseFormReturn } from 'react-hook-form';
import { createContext } from 'react';

export type ServiceRequestFormContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<ServiceRequestCreate, any, undefined>;
};

export const ServiceRequestFormContext =
  createContext<ServiceRequestFormContextType>({} as ServiceRequestFormContextType);

