import type {
  CustomsAgent,
  DeliveryData,
  Escort,
  ExtraServices,
  Notes,
  ServiceRequestCreate,
} from '../../models';

import type { Dayjs } from 'dayjs';
import { ReactNode } from 'react';
import { ServiceRequestFormContext } from './ServiceRequestFormContext';
import { useForm } from 'react-hook-form';

const initialDeliveryData: DeliveryData = {
  routeStart: '' as unknown as Dayjs,
  arriveDate: '' as unknown as Dayjs,
  company: null,
  contactExecutive: null,
  phone: null,
  email: null,
  routeId: null,
  loadingPoint: null,
  unloadingPoint: null,
  postalCode: '',
  authorizedRoute: null,
  authorizedStops: null,
};

const initialCustomsAgent: CustomsAgent = {
  agency: null,
  phone: null,
  email: null,
};

const initialEscort: Escort = {
  escorted: false,
  names: null,
  phone: null,
  company: null,
  details: null,
};

const initialNotes: Notes = {
  specialEquipment: null,
  notes: null,
};

const initialExtraServices: ExtraServices = {
  ppe: null,
  specifications: null,
  insurance: false,
  logisticBars: false,
  storage: false,
  deconsolidation: false,
  weighing: false,
  distribution: false,
  covidTest: false,
  maneuver: false,
  fumigation: false,
  safeguarding: false,
  refrigeratedConnection: false
}

const initialValues: ServiceRequestCreate = {
  branchId: '' as unknown as number,
  categoryId: '' as unknown as number,
  loadType: '',
  originAddressId: '' as unknown as number,
  OwRtReference: '',
  clientExecutive: '',
  tariff: '',
  clientId: '' as unknown as number,
  modality: '',
  serviceType: '',
  destinationAddressId: '' as unknown as number,
  invoiceReference: '',
  quotationNumber: '',
  isDangerous: false,
  services: [],
  goods: [],
  extraServices: initialExtraServices,
  deliveryData: initialDeliveryData,
  customsAgent: initialCustomsAgent,
  escort: initialEscort,
  notes: initialNotes,
};

export const ServiceRequestFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const form = useForm<ServiceRequestCreate>({
    defaultValues: initialValues,
  });
  

  return (
    <ServiceRequestFormContext.Provider value={{ form }}>
      {children}
    </ServiceRequestFormContext.Provider>
  );
};

