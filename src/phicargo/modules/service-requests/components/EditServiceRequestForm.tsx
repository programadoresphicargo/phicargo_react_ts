/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, DialogContent, DialogTitle, Typography } from '@mui/material';
import { MuiCloseButton, MuiSaveButton } from '@/components/ui';
import { SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';
import { Tab, Tabs } from '@heroui/react';
import type { Waybill, WaybillCreate, WaybillEdit } from '../models';

import { BasicInfoForm } from './BasicInfoForm';
import { ExtraInfoForm } from './ExtraInfoForm';
import { ExtraServicesForm } from './ExtraServicesForm';
import { GoodsTable } from './goods/GoodsTable';
import { LinesTable } from './lines/LinesTable';
import { ServiceDetailsForm } from './ServiceDetailsForm';
import { useEditServiceMutation } from '../hooks/queries';
import { useState } from 'react';

type Section =
  | 'basic-info'
  | 'service'
  | 'extra-info'
  | 'lines'
  | 'goods'
  | 'extra-services';

interface Props {
  onClose: () => void;
  serviceRequest: Waybill;
}

export const EditServiceRequestForm = ({ onClose, serviceRequest }: Props) => {
  const [section, setSection] = useState<Section>('basic-info');

  const form = useForm<WaybillEdit>({
    mode: 'onTouched',
    defaultValues: transformWaybillToWaybillEdit(serviceRequest),
  });

  const { handleSubmit } = form;

  const { editServiceMutation } = useEditServiceMutation();

  const onSubmit: SubmitHandler<WaybillEdit> = (data) => {
    if (editServiceMutation.isPending) return;

    editServiceMutation.mutate(
      {
        id: serviceRequest.id,
        updatedItem: data,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          color: 'white',
          background: 'linear-gradient(90deg, #0b2149, #002887)',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
          }}
        >
          Editar Solicitud de Servicio:{' '}
          <Typography
            component="span"
            sx={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            {serviceRequest.client.name}
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <MuiSaveButton
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            loading={editServiceMutation.isPending}
          />
          <MuiCloseButton onClick={onClose} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs
          aria-label="waybill-form-sections"
          variant="underlined"
          color="primary"
          selectedKey={section}
          onSelectionChange={(key) => setSection(key as Section)}
          fullWidth
          classNames={{
            tabContent: 'font-bold uppercase',
          }}
        >
          <Tab key="basic-info" title="Información básica" />
          <Tab key="service" title="Servicio" />
          <Tab key="extra-info" title="Estadisticas" />
          <Tab key="lines" title="Lineas" />
          <Tab key="goods" title="Complemento Carta Porte" />
          <Tab key="extra-services" title="Serivicios Extra" />
        </Tabs>
        <section
          style={{
            display: section === 'basic-info' ? 'block' : 'none',
          }}
        >
          <BasicInfoForm
            form={form as UseFormReturn<WaybillCreate, any, undefined>}
            maxHeight="calc(100vh - 138px)"
          />
        </section>
        <section
          style={{
            display: section === 'service' ? 'block' : 'none',
          }}
        >
          <ServiceDetailsForm
            form={form as UseFormReturn<WaybillCreate, any, undefined>}
            height="calc(100vh - 138px)"
          />
        </section>
        <section
          style={{
            display: section === 'extra-info' ? 'block' : 'none',
          }}
        >
          <ExtraInfoForm
            form={form as UseFormReturn<WaybillCreate, any, undefined>}
            maxHeight="calc(100vh - 138px)"
          />
        </section>
        <section
          style={{
            display: section === 'lines' ? 'block' : 'none',
          }}
        >
          <LinesTable
            form={form as UseFormReturn<WaybillCreate, any, undefined>}
            height="calc(100vh - 250px)"
          />
        </section>
        <section
          style={{
            display: section === 'goods' ? 'block' : 'none',
          }}
        >
          <GoodsTable
            form={form as UseFormReturn<WaybillCreate, any, undefined>}
            height="calc(100vh - 250px)"
          />
        </section>
        <section
          style={{
            display: section === 'extra-services' ? 'block' : 'none',
          }}
        >
          <ExtraServicesForm
            form={form as UseFormReturn<WaybillCreate, any, undefined>}
            height="calc(100vh - 138px)"
          />
        </section>
      </DialogContent>
    </>
  );
};

const transformWaybillToWaybillEdit = (waybill: Waybill): WaybillEdit => {
  return {
    storeId: waybill.branch.id,
    companyId: waybill.company.id,
    waybillCategory: waybill.category.id,
    partnerId: waybill.client,
    partnerOrderId: waybill.partnerOrder,
    departureAddressId: waybill.departureAddress,
    xCodigoPostal: waybill.xCodigoPostal,
    xReferenceOwr: waybill.xReferenceOwr,
    xReference: waybill.xReference,
    xReference2: waybill.xReference2,
    xRutaAutorizada: waybill.xRutaAutorizada,
    dateOrder: waybill.dateOrder,
    expectedDateDelivery: waybill.expectedDateDelivery,
    currencyId: 1, // MXN
    partnerInvoiceId: waybill.partnerInvoice,
    arrivalAddressId: waybill.arrivalAddress,
    clientOrderRef: waybill.clientOrderRef,
    uploadPoint: waybill.uploadPoint,
    downloadPoint: waybill.downloadPoint,
    xEjecutivo: waybill.xEjecutivo,
    dangerousCargo: waybill.dangerousCargo,
    xParadasAutorizadas: waybill.xParadasAutorizadas,
    xNumeroCotizacion: waybill.xNumeroCotizacion,
    xTarifa: waybill.xTarifa,
    dateStart: waybill.dateStart,
    xDateArrivalShed: waybill.xDateArrivalShed,
    xSubclienteBel: waybill.xSubclienteBel,
    xContactoSubcliente: waybill.xContactoSubcliente,
    xTelefonoSubcliente: waybill.xTelefonoSubcliente,
    xCorreoSubcliente: waybill.xCorreoSubcliente,
    xNombreAgencia: waybill.xNombreAgencia,
    xTelefonoAa: waybill.xTelefonoAa,
    xEmailAa: waybill.xEmailAa,
    xCustodiaBel: waybill.xCustodiaBel,
    xNombreCustodios: waybill.xNombreCustodios,
    xEmpresaCustodia: waybill.xEmpresaCustodia,
    xTelefonoCustodios: waybill.xTelefonoCustodios,
    xDatosUnidad: waybill.xDatosUnidad,
    xRutaBel: waybill.xRutaBel,
    xRutaDestino: waybill.xRutaDestino,
    xTipoBel: waybill.xTipoBel,
    xTipo2Bel: waybill.xTipo2Bel,
    xModoBel: waybill.xModoBel,
    xClaseBel: waybill.xClaseBel,
    xMedidaBel: waybill.xMedidaBel,
    xAlmacenaje: waybill.xAlmacenaje,
    xBarrasLogisticas: waybill.xBarrasLogisticas,
    xConexionRefrigerado: waybill.xConexionRefrigerado,
    xDesconsolidacion: waybill.xDesconsolidacion,
    xFumigacion: waybill.xFumigacion,
    xManiobraCargaDescarga: waybill.xManiobraCargaDescarga,

    xPesaje: waybill.xPesaje,
    xPruebaCovid: waybill.xPruebaCovid,
    xReparto: waybill.xReparto,
    xResguardo: waybill.xResguardo,
    xSeguro: waybill.xSeguro,
    xEpp: waybill.xEpp,
    xEspecificacionesEspeciales: waybill.xEspecificacionesEspeciales,
    shippedProducts: [],
    complementCp: [],
  };
};

