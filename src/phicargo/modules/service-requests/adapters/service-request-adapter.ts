import type {
  ComplementCpApi,
  ShippedProductApi,
  WaybillApi,
  WaybillBaseApi,
  WaybillCreateApi,
} from '../models/api';
import type {
  ComplementCpCreate,
  ShippedProductCreate,
  Waybill,
  WaybillBase,
  WaybillCreate,
} from '../models';

import dayjs from 'dayjs';

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
      sequence_id: data.sequence_id,
      state: data.state,
      branch: data.branch,
      company: data.company,
      category: data.category,
      client: data.client,
      partnerOrder: data.partner_order,
      departureAddress: data.departure_address,
      partnerInvoice: data.partner_invoice,
      arrivalAddress: data.arrival_address,
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
}

