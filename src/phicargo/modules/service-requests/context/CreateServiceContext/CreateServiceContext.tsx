import { ReactNode, createContext, useState } from 'react';
import { SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';

import { Contact } from '@/phicargo/modules/contacts/models';
import type { WaybillCreate } from '../../models';
import dayjs from 'dayjs';

const steps = [
  'Información básica',
  'Servicio',
  'Estadisticas',
  'Lineas',
  'Complemento Carta Porte',
  'Serivicios Extra',
];

export type CreateServiceContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<WaybillCreate, any, undefined>;
  steps: string[];
  activeStep: number;
  handleReset: () => void;
  handleNext: () => void;
  handleBack: () => void;
  submit: () => void;
};

const CreateServiceContext = createContext<CreateServiceContextType>(
  {} as CreateServiceContextType,
);

export const CreateServiceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const form = useForm<WaybillCreate>({
    defaultValues: initialValues,
    mode: 'onTouched',
  });
  const { trigger, handleSubmit } = form;

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    trigger().then((isValid) => {
      if (isValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const onSubmit: SubmitHandler<WaybillCreate> = (data) => {
    console.log(data);
  };

  const submit = () => handleSubmit(onSubmit);

  return (
    <CreateServiceContext.Provider
      value={{
        form,
        steps,
        activeStep,
        handleReset,
        handleNext,
        handleBack,
        submit,
      }}
    >
      {children}
    </CreateServiceContext.Provider>
  );
};

export default CreateServiceContext;

const initialValues: WaybillCreate = {
  storeId: 1, // Veracruz
  companyId: 1, // Belchez
  waybillCategory: '' as unknown as number,
  partnerId: '' as unknown as Contact,
  partnerOrderId: '' as unknown as Contact,
  departureAddressId: {
    id: 1,
    customer: false,
    supplier: false,
    name: 'TRANSPORTES BELCHEZ',
    street: 'S/N/SN CARRETERA VERACRUZ CARDEL KM 13.5',
  },
  xCodigoPostal: '0',
  xReferenceOwr: '',
  xReference: null,
  xReference2: null,
  xRutaAutorizada: null,
  dateOrder: dayjs(),
  expectedDateDelivery: dayjs(),
  currencyId: 1, // MXN
  partnerInvoiceId: null,
  arrivalAddressId: null,
  clientOrderRef: null,
  uploadPoint: null,
  downloadPoint: null,
  xEjecutivo: null,
  dangerousCargo: false,
  xParadasAutorizadas: null,
  xNumeroCotizacion: null,
  xTarifa: null,
  dateStart: null,
  xDateArrivalShed: null,
  xSubclienteBel: null,
  xContactoSubcliente: null,
  xTelefonoSubcliente: null,
  xCorreoSubcliente: null,
  xNombreAgencia: null,
  xTelefonoAa: null,
  xEmailAa: null,
  xCustodiaBel: null,
  xNombreCustodios: null,
  xEmpresaCustodia: null,
  xTelefonoCustodios: null,
  xDatosUnidad: null,
  xRutaBel: null,
  xRutaDestino: null,
  xTipoBel: '',
  xTipo2Bel: '',
  xModoBel: '',
  xAlmacenaje: false,
  xBarrasLogisticas: false,
  xConexionRefrigerado: false,
  xDesconsolidacion: false,
  xFumigacion: false,
  xManiobraCargaDescarga: false,

  xPesaje: false,
  xPruebaCovid: false,
  xReparto: false,
  xResguardo: false,
  xSeguro: false,
  xEpp: null,
  xEspecificacionesEspeciales: null,
  shippedProducts: [],
  complementCp: [],
};

