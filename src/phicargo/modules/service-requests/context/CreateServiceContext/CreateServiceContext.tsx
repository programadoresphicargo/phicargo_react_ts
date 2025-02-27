import { ReactNode, createContext, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';

import type { WaybillCreate } from '../../models';

const steps = [
  'Información básica',
  'Servicio',
  'Estadisticas',
  'Lineas',
  'Complemento Carta Porte',
  'Serivicios Extra',
  // 'Custodia',
  // 'Carga',
  // 'Agencia Aduanal',
];

export type CreateServiceContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<WaybillCreate, any, undefined>;
  steps: string[];
  activeStep: number;
  handleReset: () => void;
  handleNext: () => void;
  handleBack: () => void;
};

const CreateServiceContext = createContext<CreateServiceContextType>(
  {} as CreateServiceContextType,
);

export const CreateServiceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const form = useForm<WaybillCreate>();
  const { trigger } = form;

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

  return (
    <CreateServiceContext.Provider
      value={{
        form,
        steps,
        activeStep,
        handleReset,
        handleNext,
        handleBack,
      }}
    >
      {children}
    </CreateServiceContext.Provider>
  );
};

export default CreateServiceContext;

