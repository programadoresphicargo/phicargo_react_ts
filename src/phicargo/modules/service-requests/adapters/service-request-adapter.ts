import type {
  ComplementCpApi,
  ShippedProductApi,
  WaybillCreateApi,
} from '../models/api';
import type {
  ComplementCpCreate,
  ShippedProductCreate,
  WaybillCreate,
} from '../models';

export class ServiceRequestAdapter {
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

