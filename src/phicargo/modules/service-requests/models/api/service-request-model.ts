import { BranchSimple, CompanySimple } from "@/phicargo/modules/core/models";
import { PartnerApi, WaybillCategoryApi } from "./waybill-models";

export interface WaybillBaseApi {
  upload_point: string | null;
  download_point: string | null;
  
  x_codigo_postal: string;
  x_reference_owr: string;

  x_reference: string | null;
  x_reference_2: string | null;
  
  x_ruta_autorizada: string | null;
  date_order: string;
  expected_date_delivery: string | null;

  client_order_ref: string | null;

  x_ejecutivo: string | null;
  dangerous_cargo: boolean;

  x_paradas_autorizadas: string | null;
 
  x_numero_cotizacion: string | null;
  x_tarifa: number | null;

  // Delivery Data
  // Programado
  date_start: string | null;  
  x_date_arrival_shed: string | null;

  // Load data
  x_subcliente_bel: string | null;
  x_contacto_subcliente: string | null;
  x_telefono_subcliente: string | null;
  x_correo_subcliente: string | null;
  
  // Scheduled Route
  x_ruta_bel: string | null;
  x_ruta_destino: number | null;
  x_tipo_bel: string;
  x_tipo2_bel: string;
  x_modo_bel: string;

  // Customs Agent
  x_nombre_agencia: string | null;
  x_telefono_aa: string | null;
  x_email_aa: string | null;

  // Custodia
  x_custodia_bel: string | null;
  x_nombre_custodios: string | null;
  x_empresa_custodia: string | null;
  x_telefono_custodios: string | null;
  x_datos_unidad: string | null;

  // Extra services
  x_almacenaje: boolean;
  x_barras_logisticas: boolean;
  x_conexion_refrigerado: boolean;
  x_desconsolidacion: boolean;
  x_fumigacion: boolean;
  x_maniobra_carga_descarga: boolean;
  x_pesaje: boolean;
  x_prueba_covid: boolean;
  x_reparto: boolean;
  x_resguardo: boolean;
  x_seguro: boolean;

  x_epp: string | null;
  x_especificaciones_especiales: string | null;
}

export interface WaybillApi extends WaybillBaseApi {
  id: number;
  sequence_id: number;
  state: string;
  branch: BranchSimple;
  company: CompanySimple;
  category: WaybillCategoryApi;

  client: PartnerApi;
  partner_order: PartnerApi;
  departure_address: PartnerApi;
  partner_invoice: PartnerApi;
  arrival_address: PartnerApi;
}

export interface WaybillCreateApi extends WaybillBaseApi {
  store_id: number;
  company_id: number;
  waybill_category: number;
  
  partner_id: number;
  partner_order_id: number;
  departure_address_id: number;
  
  currency_id: number;

  partner_invoice_id: number | null;
  arrival_address_id: number | null;

  shipped_products: ShippedProductApi[];
  complement_cp: ComplementCpApi[];
}

export interface ComplementCpApi {
  description: string;
  sat_product_id: number;
  quantity: number;
  sat_uom_id: number;
  weight_charge: number;
  hazardous_material: string;
  hazardous_key_product_id: number | null;
  tipo_embalaje_id: number | null;
}

export interface ShippedProductApi {
  product_id: number;
  product_uom_qty_est: number;
  weight_estimation: number;
  notes: string;
}

