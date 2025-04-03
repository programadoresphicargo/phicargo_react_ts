import { Checkbox, Radio, RadioGroup } from '@heroui/react';
import {
  DatePickerInput,
  SelectInput,
  TextareaInput,
} from '@/components/inputs';
import type { IncidenceCreate, IncidenceType } from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { INCIDENCE_OPTIONS } from '../../utilities';
import { useIncidenceQueries } from '../../hooks/queries';

const intialState: IncidenceCreate = {
  incidence: '',
  comments: '',
  startDate: null,
  endDate: null,
  type: 'operative',
};

interface Props {
  driverId: number;
  setIsLoading?: (value: boolean) => void;
  setSubmit: (callback: () => void) => void;
  onSuccessfulSubmit?: () => void;
}

export const IncidenceForm = ({
  driverId,
  setSubmit,
  setIsLoading,
  onSuccessfulSubmit,
}: Props) => {
  const [selectedType, setSelectedType] = useState<IncidenceType>('operative');
  const [createUnavailability, setCreateUnavailability] = useState(false);

  const { createIncidence } = useIncidenceQueries();

  const { control, handleSubmit, reset } = useForm<IncidenceCreate>({
    defaultValues: intialState,
  });

  // Función de envío
  const submit: SubmitHandler<IncidenceCreate> = (data) => {
    createIncidence.mutate(
      {
        driverId: driverId,
        incidence: { ...data, type: selectedType },
      },
      {
        onSuccess: () => {
          reset(intialState);
          if (onSuccessfulSubmit) onSuccessfulSubmit();
        },
      },
    );
  };

  useEffect(() => {
    if (setSubmit) {
      setSubmit(() => handleSubmit(submit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSubmit, handleSubmit]);

  useEffect(() => {
    if (setIsLoading) {
      setIsLoading(createIncidence.isPending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createIncidence.isPending]);

  return (
    <form className="flex flex-col gap-4">
      <RadioGroup
        label="Tipo de Incidencia"
        orientation="horizontal"
        className="flex flex-row gap-4 justify-center"
        value={selectedType}
        onValueChange={(value) => setSelectedType(value as IncidenceType)}
      >
        <Radio value="operative">Operativa</Radio>
        <Radio value="legal">Legal</Radio>
      </RadioGroup>

      <SelectInput
        control={control}
        name="incidence"
        variant="faded"
        label="Tipo de Incidencia"
        items={INCIDENCE_OPTIONS}
        rules={{ required: 'Tipo de incidencia requerida' }}
      />
      <TextareaInput
        control={control}
        name="comments"
        label="Comentarios"
        variant="faded"
        isUpperCase
        minRows={6}
        rules={{ required: 'Comentario requerido' }}
      />
      <Checkbox
        isSelected={createUnavailability}
        onValueChange={setCreateUnavailability}
      >
        Crear Indisponibilidad
      </Checkbox>
      {createUnavailability && (
        <div className="flex flex-row gap-4">
          <DatePickerInput
            control={control}
            variant="faded"
            name="startDate"
            label="Fecha Inicio"
            rules={{ required: 'Fecha de inicio requerida' }}
          />

          <DatePickerInput
            control={control}
            variant="faded"
            name="endDate"
            label="Fecha Fin"
            rules={{ required: 'Fecha de fin requerida' }}
          />
        </div>
      )}
    </form>
  );
};

