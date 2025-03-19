import { BranchSimple, CompanySimple } from '../../core/models';
import type { Partner, WaybillCategory, WaybillItem } from './waybill-models';

import type { Contact } from '../../contacts/models';
import type { Dayjs } from 'dayjs';

export type WaybillStatus = 'draft' | 'cancel';

export interface WaybillBase {
  xCodigoPostal: string;
  xReferenceOwr: string;

  xReference: string | null;
  xReference2: string | null;

  xRutaAutorizada: string | null;
  dateOrder: Dayjs;
  expectedDateDelivery: Dayjs | null;

  clientOrderRef: string | null;

  uploadPoint: string | null;
  downloadPoint: string | null;

  xEjecutivo: string | null;
  dangerousCargo: boolean;

  xParadasAutorizadas: string | null;

  xNumeroCotizacion: string | null;
  xTarifa: number | null;

  // Service Data
  xRutaBel: string | null;
  xRutaDestino: number | null;
  xTipoBel: string;
  xTipo2Bel: string;
  xModoBel: string;
  xMedidaBel: string | null;
  xClaseBel: string | null;

  // Estadisticas
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
}

export interface Waybill extends WaybillBase {
  id: number;
  name: string | null;
  sequence_id: number;
  state: WaybillStatus;
  branch: BranchSimple;
  company: CompanySimple;
  category: WaybillCategory;
  client: Partner;
  partnerOrder: Partner;
  departureAddress: Partner;
  partnerInvoice: Partner;
  arrivalAddress: Partner;
}

export interface WaybillCreate extends WaybillBase {
  // Begin
  storeId: number;
  companyId: number;
  waybillCategory: number;

  partnerId: Contact;
  partnerOrderId: Contact;
  departureAddressId: Contact;

  currencyId: number;

  partnerInvoiceId: Contact | null;
  arrivalAddressId: Contact | null;

  shippedProducts: ShippedProductCreate[];
  complementCp: ComplementCpCreate[];
}

export interface ComplementCpCreate {
  description: string;
  satProductId: WaybillItem;
  quantity: number;
  satUomId: WaybillItem;
  dimensionsCharge: string;
  weightCharge: number;
  hazardousMaterial: string;
  hazardousKeyProductId: WaybillItem | null;
  tipoEmbalajeId: WaybillItem | null;
}

export interface ShippedProductCreate {
  productId: number;
  productUomQtyEst: number;
  weightEstimation: number;
  notes: string;
}

export interface ServiceCreate {
  productId: number;
  estamatedWeight: number;
  notes: string;
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

