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


export interface WaybillCreate {
  // Begin
  storeId: number;
  companyId: number;
  waybillCategory: number;
  
  partnerId: number;
  partnerOrderId: number;
  departureAddressId: number;
  
  xCodigoPostal: string;
  xReferenceOwr: string;

  xReference: string | null;
  xReference2: string | null;
  
  xRutaAutorizada: string | null;
  dateOrder: Dayjs;
  expectedDateDelivery: string | null;

  currencyId: number;

  partnerInvoiceId: number | null;
  arrivalAddressId: number | null;

  clientOrderRef: string | null;

  uploadPoint: string | null;
  downloadPoint: string | null;

  xEjecutivo: string | null;
  dangerousCargo: boolean;

  xParadasAutorizadas: string | null;
 
  xNumeroCotizacion: string | null;
  xTarifa: number | null;

  // Delivery Data
  // Programado
  dateStart: Dayjs | null;  
  xDateArrivalShed: Dayjs | null;

  // Load data
  xSubclienteBel: string | null;
  xContactoSubcliente: string | null;
  xTelefonoSubcliente: string | null;
  xCorreoSubcliente: string | null;

  
  // Customs Agent
  xNombreAgencia: string | null;
  xTelefonoAa: string | null;
  xEmailAa: string | null;

  // Custodia
  xCustodiaBel: string | null;
  xNombreCustodios: string | null;
  xEmpresaCustodia: string | null;
  xTelefonoCustodios: string | null;
  xDatosUnidad: string | null;

    // Service Data
    xRutaBel: number | null;
    xRutaDestino: number | null;
    xTipoBel: string;
    xTipo2Bel: string;
    xModoBel: string;

  // Extra services
  xAlmacenaje: boolean;
  xBarrasLogisticas: boolean;
  xConexionRefrigerado: boolean;
  xDesconsolidacion: boolean;
  xFumigacion: boolean;
  xManiobraCargaDescarga: boolean;
  xPesaje: boolean;
  xPruebaCovid: boolean;
  xReparto: boolean;
  xResguardo: boolean;
  xSeguro: boolean;

  xEpp: string | null;
  xEspecificacionesEspeciales: string | null;
  
  shippedProducts: ShippedProductCreate[];
  complementCp: ComplementCpCreate[];
}


export interface ComplementCpCreate {
  description: string;
  satProductId: number;
  quantity: number;
  satUomId: number;
  dimensionsCharge: string;
  weightCharge: number;
  hazardousMaterial: string;
  hazardousKeyProductId: number | null;
  tipoEmbalajeId: number | null;
}

export interface ShippedProductCreate {
  productId: number;
  productUomQtyEst: number;
  weightEstimation: number;
  notes: string;
}

