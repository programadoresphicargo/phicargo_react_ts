import type {
  ComplementCpApi,
  PartnerApi,
  ShippedProductApi,
  WaybillApi,
  WaybillBaseApi,
  WaybillCreateApi,
  WaybillEditApi,
} from '../models/api';
import type {
  ComplementCpCreate,
  Partner,
  ShippedProductCreate,
  Waybill,
  WaybillBase,
  WaybillCreate,
  WaybillEdit,
} from '../models';

import dayjs from 'dayjs';

const toPartner = (data: PartnerApi): Partner => ({
  id: data.id,
  name: data.name,
  street: data.street,
  customer: false,
  supplier: false,
})

export class ServiceRequestAdapter {
  static toWaybillBase(data: WaybillBaseApi): WaybillBase {
    return {
      xCodigoPostal: data.x_codigo_postal,
      xReferenceOwr: data.x_reference_owr,
      xReference: data.x_reference,
      xReference2: data.x_reference_2,
      xRutaAutorizada: data.x_ruta_autorizada,
      dateOrder: dayjs(data.date_order),
      expectedDateDelivery: data.expected_date_delivery
        ? dayjs(data.expected_date_delivery)
        : null,
      clientOrderRef: data.client_order_ref,
      uploadPoint: data.upload_point,
      downloadPoint: data.download_point,
      xEjecutivo: data.x_ejecutivo,
      dangerousCargo: data.dangerous_cargo,
      xParadasAutorizadas: data.x_paradas_autorizadas,
      xNumeroCotizacion: data.x_numero_cotizacion,
      xTarifa: data.x_tarifa,
      xRutaBel: data.x_ruta_bel,
      xRutaDestino: data.x_ruta_destino,
      xTipoBel: data.x_tipo_bel,
      xTipo2Bel: data.x_tipo2_bel,
      xModoBel: data.x_modo_bel,
      xClaseBel: data.x_clase_bel,
      xMedidaBel: data.x_medida_bel,
      dateStart: data.date_start ? dayjs(data.date_start) : null,
      xDateArrivalShed: data.x_date_arrival_shed
        ? dayjs(data.x_date_arrival_shed)
        : null,
      xSubclienteBel: data.x_subcliente_bel,
      xContactoSubcliente: data.x_contacto_subcliente,
      xTelefonoSubcliente: data.x_telefono_subcliente,
      xCorreoSubcliente: data.x_correo_subcliente,
      xNombreAgencia: data.x_nombre_agencia,
      xTelefonoAa: data.x_telefono_aa,
      xEmailAa: data.x_email_aa,
      xCustodiaBel: data.x_custodia_bel,
      xNombreCustodios: data.x_nombre_custodios,
      xEmpresaCustodia: data.x_empresa_custodia,
      xTelefonoCustodios: data.x_telefono_custodios,
      xDatosUnidad: data.x_datos_unidad,
      xAlmacenaje: data.x_almacenaje,
      xBarrasLogisticas: data.x_barras_logisticas,
      xConexionRefrigerado: data.x_conexion_refrigerado,
      xDesconsolidacion: data.x_desconsolidacion,
      xFumigacion: data.x_fumigacion,
      xManiobraCargaDescarga: data.x_maniobra_carga_descarga,
      xPesaje: data.x_pesaje,
      xPruebaCovid: data.x_prueba_covid,
      xReparto: data.x_reparto,
      xResguardo: data.x_resguardo,
      xSeguro: data.x_seguro,
      xEpp: data.x_epp,
      xEspecificacionesEspeciales: data.x_especificaciones_especiales,
    };
  }

  static toWaybill(data: WaybillApi): Waybill {
    return {
      ...ServiceRequestAdapter.toWaybillBase(data),
      id: data.id,
      name: data.name,
      sequence_id: data.sequence_id,
      state: data.state,
      branch: data.branch,
      company: data.company,
      category: data.category,
      client: toPartner(data.client),
      partnerOrder: toPartner(data.partner_order),
      departureAddress: toPartner(data.departure_address),
      partnerInvoice: toPartner(data.partner_invoice),
      arrivalAddress: toPartner(data.arrival_address),
    };
  }

  static toShippedProductCreate(data: ShippedProductCreate): ShippedProductApi {
    return {
      product_id: data.productId,
      product_uom_qty_est: data.productUomQtyEst,
      weight_estimation: data.weightEstimation,
      notes: data.notes,
    };
  }

  static toComplementCpCreate(data: ComplementCpCreate): ComplementCpApi {
    return {
      description: data.description,
      sat_product_id: data.satProductId?.id,
      quantity: data.quantity,
      sat_uom_id: data.satUomId?.id,
      weight_charge: data.weightCharge,
      hazardous_material: data.hazardousMaterial,
      hazardous_key_product_id: data.hazardousKeyProductId?.id ?? null,
      tipo_embalaje_id: data.tipoEmbalajeId?.id ?? null,
    };
  }

  public static toWaybillCreate(data: WaybillCreate): WaybillCreateApi {
    return {
      store_id: data.storeId,
      company_id: data.companyId,
      waybill_category: data.waybillCategory,
      partner_id: data.partnerId?.id,
      partner_order_id: data.partnerOrderId?.id,
      departure_address_id: data.departureAddressId?.id,
      upload_point: data.uploadPoint,
      download_point: data.downloadPoint,
      x_codigo_postal: data.xCodigoPostal,
      x_reference_owr: data.xReferenceOwr,
      x_reference: data.xReference,
      x_reference_2: data.xReference2,
      x_ruta_autorizada: data.xRutaAutorizada,
      date_order: data.dateOrder.format('YYYY-MM-DD'),
      expected_date_delivery:
        data.expectedDateDelivery?.format('YYYY-MM-DD') ?? null,
      currency_id: data.currencyId,
      partner_invoice_id: data.partnerInvoiceId?.id ?? null,
      arrival_address_id: data.arrivalAddressId?.id ?? null,
      client_order_ref: data.clientOrderRef,
      x_ejecutivo: data.xEjecutivo,
      dangerous_cargo: data.dangerousCargo,
      x_paradas_autorizadas: data.xParadasAutorizadas,
      x_numero_cotizacion: data.xNumeroCotizacion,
      x_tarifa: data.xTarifa,
      date_start: data.dateStart?.format('YYYY-MM-DD hh:mm:ss') ?? null,
      x_date_arrival_shed:
        data.xDateArrivalShed?.format('YYYY-MM-DD hh:mm:ss') ?? null,
      x_subcliente_bel: data.xSubclienteBel,
      x_contacto_subcliente: data.xContactoSubcliente,
      x_telefono_subcliente: data.xTelefonoSubcliente,
      x_correo_subcliente: data.xCorreoSubcliente,
      x_ruta_bel: data.xRutaBel,
      x_ruta_destino: data.xRutaDestino,
      x_tipo_bel: data.xTipoBel,
      x_tipo2_bel: data.xTipo2Bel,
      x_modo_bel: data.xModoBel,
      x_medida_bel: data.xMedidaBel,
      x_clase_bel: data.xClaseBel,
      x_nombre_agencia: data.xNombreAgencia,
      x_telefono_aa: data.xTelefonoAa,
      x_email_aa: data.xEmailAa,
      x_custodia_bel: data.xCustodiaBel,
      x_nombre_custodios: data.xNombreCustodios,
      x_empresa_custodia: data.xEmpresaCustodia,
      x_telefono_custodios: data.xTelefonoCustodios,
      x_datos_unidad: data.xDatosUnidad,
      x_almacenaje: data.xAlmacenaje,
      x_barras_logisticas: data.xBarrasLogisticas,
      x_conexion_refrigerado: data.xConexionRefrigerado,
      x_desconsolidacion: data.xDesconsolidacion,
      x_fumigacion: data.xFumigacion,
      x_maniobra_carga_descarga: data.xManiobraCargaDescarga,
      x_pesaje: data.xPesaje,
      x_prueba_covid: data.xPruebaCovid,
      x_reparto: data.xReparto,
      x_resguardo: data.xResguardo,
      x_seguro: data.xSeguro,
      x_epp: data.xEpp,
      x_especificaciones_especiales: data.xEspecificacionesEspeciales,
      shipped_products: data.shippedProducts.map(
        ServiceRequestAdapter.toShippedProductCreate,
      ),
      complement_cp: data.complementCp.map(
        ServiceRequestAdapter.toComplementCpCreate,
      ),
    };
  }

  public static toWaybillEdit(data: WaybillEdit): WaybillEditApi {

    const waybill: WaybillEditApi = {};
    
    if (data.storeId) waybill.store_id = data.storeId;
    if (data.companyId) waybill.company_id = data.companyId;
    if (data.waybillCategory) waybill.waybill_category = data.waybillCategory;
    if (data.partnerId) waybill.partner_id = data.partnerId.id;
    if (data.partnerOrderId) waybill.partner_order_id = data.partnerOrderId.id;
    if (data.departureAddressId) waybill.departure_address_id = data.departureAddressId.id;
    if (data.uploadPoint) waybill.upload_point = data.uploadPoint;
    if (data.downloadPoint) waybill.download_point = data.downloadPoint;
    if (data.xCodigoPostal) waybill.x_codigo_postal = data.xCodigoPostal;
    if (data.xReferenceOwr) waybill.x_reference_owr = data.xReferenceOwr;
    if (data.xReference) waybill.x_reference = data.xReference;
    if (data.xReference2) waybill.x_reference_2 = data.xReference2;
    if (data.xRutaAutorizada) waybill.x_ruta_autorizada = data.xRutaAutorizada;
    if (data.dateOrder) waybill.date_order = data.dateOrder.format('YYYY-MM-DD');
    if (data.expectedDateDelivery) waybill.expected_date_delivery = data.expectedDateDelivery.format('YYYY-MM-DD');
    if (data.currencyId) waybill.currency_id = data.currencyId;
    if (data.partnerInvoiceId) waybill.partner_invoice_id = data.partnerInvoiceId.id;
    if (data.arrivalAddressId) waybill.arrival_address_id = data.arrivalAddressId.id;
    if (data.clientOrderRef) waybill.client_order_ref = data.clientOrderRef;
    if (data.xEjecutivo) waybill.x_ejecutivo = data.xEjecutivo;
    if (data.dangerousCargo) waybill.dangerous_cargo = data.dangerousCargo;
    if (data.xParadasAutorizadas) waybill.x_paradas_autorizadas = data.xParadasAutorizadas;
    if (data.xNumeroCotizacion) waybill.x_numero_cotizacion = data.xNumeroCotizacion;
    if (data.xTarifa) waybill.x_tarifa = data.xTarifa;
    if (data.dateStart) waybill.date_start = data.dateStart.format('YYYY-MM-DD hh:mm:ss');
    if (data.xDateArrivalShed) waybill.x_date_arrival_shed = data.xDateArrivalShed.format('YYYY-MM-DD hh:mm:ss');
    if (data.xSubclienteBel) waybill.x_subcliente_bel = data.xSubclienteBel;
    if (data.xContactoSubcliente) waybill.x_contacto_subcliente = data.xContactoSubcliente;
    if (data.xTelefonoSubcliente) waybill.x_telefono_subcliente = data.xTelefonoSubcliente; 
    if (data.xCorreoSubcliente) waybill.x_correo_subcliente = data.xCorreoSubcliente;
    if (data.xRutaBel) waybill.x_ruta_bel = data.xRutaBel;
    if (data.xRutaDestino) waybill.x_ruta_destino = data.xRutaDestino;
    if (data.xTipoBel) waybill.x_tipo_bel = data.xTipoBel;
    if (data.xTipo2Bel) waybill.x_tipo2_bel = data.xTipo2Bel;
    if (data.xModoBel) waybill.x_modo_bel = data.xModoBel;
    if (data.xMedidaBel) waybill.x_medida_bel = data.xMedidaBel;
    if (data.xClaseBel) waybill.x_clase_bel = data.xClaseBel;

    if (data.xNombreAgencia) waybill.x_nombre_agencia = data.xNombreAgencia;
    if (data.xTelefonoAa) waybill.x_telefono_aa = data.xTelefonoAa;

    if (data.xEmailAa) waybill.x_email_aa = data.xEmailAa;
    if (data.xCustodiaBel) waybill.x_custodia_bel = data.xCustodiaBel;  
    if (data.xNombreCustodios) waybill.x_nombre_custodios = data.xNombreCustodios;
    if (data.xEmpresaCustodia) waybill.x_empresa_custodia = data.xEmpresaCustodia;

    if (data.xTelefonoCustodios) waybill.x_telefono_custodios = data.xTelefonoCustodios;

    if (data.xDatosUnidad) waybill.x_datos_unidad = data.xDatosUnidad;
    if (data.xAlmacenaje !== undefined && data.xAlmacenaje !== null) waybill.x_almacenaje = data.xAlmacenaje;
    if (data.xBarrasLogisticas !== undefined) waybill.x_barras_logisticas = data.xBarrasLogisticas;
    if (data.xConexionRefrigerado !== undefined) waybill.x_conexion_refrigerado = data.xConexionRefrigerado;
    if (data.xDesconsolidacion !== undefined) waybill.x_desconsolidacion = data.xDesconsolidacion;
    if (data.xFumigacion !== undefined) waybill.x_fumigacion = data.xFumigacion;  
    if (data.xManiobraCargaDescarga !== undefined) waybill.x_maniobra_carga_descarga = data.xManiobraCargaDescarga;
    if (data.xPesaje !== undefined) waybill.x_pesaje = data.xPesaje;

    if (data.xPruebaCovid !== undefined) waybill.x_prueba_covid = data.xPruebaCovid;
    if (data.xReparto !== undefined) waybill.x_reparto = data.xReparto;
    if (data.xResguardo !== undefined) waybill.x_resguardo = data.xResguardo;
    if (data.xSeguro !== undefined) waybill.x_seguro = data.xSeguro;
    if (data.xEpp !== undefined) waybill.x_epp = data.xEpp;
    if (data.xEspecificacionesEspeciales) waybill.x_especificaciones_especiales = data.xEspecificacionesEspeciales;

    // if (data.shippedProducts) waybill.shipped_products = data.shippedProducts.map(ServiceRequestAdapter.toShippedProductCreate);
    // if (data.complementCp) waybill.complement_cp = data.complementCp.map(ServiceRequestAdapter.toComplementCpCreate);
    
    return waybill;

  }
}

