import type { Dayjs } from 'dayjs';

export interface ServiceCreate {
  productId: number;
  estamatedWeight: number;
  notes: string;
}

export interface CustomsAgent {
  agency: string | null;
  phone: string | null;
  email: string | null;
}

export interface DeliveryData {
  routeStart: Dayjs;
  arriveDate: Dayjs;
  company: string | null;
  contactExecutive: string | null;
  phone: string | null;
  email: string | null;
  routeId: number | null;
  loadingPoint: string | null;
  unloadingPoint: string | null;
  postalCode: string;
  authorizedRoute: string | null;
  authorizedStops: string | null;
}

export interface Good {
  description: string;
  quantity: number;
  udmSatId: number;
  isDangerous: boolean;
  packagingTypeId: number;
  dimensions: string;
  goodSatId: number;
  weight: number;
  hazardousMaterialKey: number;
}

export interface Escort {
  escorted: boolean;
  names: string | null;
  phone: string | null;
  company: string | null;
  details: string | null;
}

export interface Notes {
  specialEquipment: string | null;
  notes: string | null;
}

export interface ExtraServices {
  ppe: string | null;
  specifications: string | null;
  insurance: boolean;
  logisticBars: boolean;
  storage: boolean;
  deconsolidation: boolean;
  weighing: boolean;
  distribution: boolean;
  covidTest: boolean;
  maneuver: boolean;
  fumigation: boolean;
  safeguarding: boolean;
  refrigeratedConnection: boolean;
}

export interface ServiceRequestCreate {
  branchId: number;
  categoryId: number;
  loadType: string;
  originAddressId: number;
  OwRtReference: string;
  clientExecutive: string;
  tariff: string | null;
  clientId: number;
  modality: string;
  serviceType: string;
  destinationAddressId: number;
  invoiceReference: string;
  quotationNumber: string | null;
  isDangerous: boolean;

  extraServices: ExtraServices;

  services: ServiceCreate[];

  deliveryData: DeliveryData;
  goods: Good[];
  customsAgent: CustomsAgent;
  escort: Escort;
  notes: Notes;
}

