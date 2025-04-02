import {
  RadioButtonGroup,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@heroui/react';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { DayOffCreate } from '../models';
import { MuiSimpleModal } from '@/components';
import { SaveButton } from '@/components/ui';
import dayjs from 'dayjs';
import { useCreateDayOffMutation } from '../hooks/mutations';

const initialValues: DayOffCreate = {
  type: 'feriado',
  dateOff: dayjs(),
  description: '',
  storeId: '0' as unknown as number,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateDayOffModal = ({ open, onClose }: Props) => {
  const { control, handleSubmit, reset } = useForm<DayOffCreate>({
    defaultValues: initialValues,
  });

  const { createDayOffMutation } = useCreateDayOffMutation();

  const onSubmit: SubmitHandler<DayOffCreate> = (data) => {
    if (createDayOffMutation.isPending) return;

    data.storeId =
      data.storeId === ('0' as unknown as number) ? null : data.storeId;

    createDayOffMutation.mutate(data, {
      onSuccess: () => {
        reset(initialValues);
        onClose();
      },
    });
  };

  return (
    <MuiSimpleModal
      open={open}
      onClose={onClose}
      header="Crear Día Inhábil"
      customFooter={
        <>
          <Button
            variant="light"
            color="danger"
            size="sm"
            radius="full"
            onPress={onClose}
          >
            Cancelar
          </Button>
          <SaveButton
            isLoading={createDayOffMutation.isPending}
            onPress={() => handleSubmit(onSubmit)()}
          />
        </>
      }
    >
      <form className="flex flex-col gap-4 p-4">
        <SelectElement
          control={control}
          name="type"
          label="Tipo"
          size="small"
          required
          rules={{ required: 'Campo requerido' }}
          options={[
            { id: 'feriado', label: 'Feriado' },
            { id: 'inhabil', label: 'Inhábil' },
            { id: 'norte', label: 'Norte' },
            { id: 'otro', label: 'Otro' },
          ]}
        />
        <DatePickerElement
          control={control}
          name="dateOff"
          label="Fecha"
          inputProps={{ size: 'small' }}
          required
          rules={{ required: 'Campo requerido' }}
        />
        <TextFieldElement
          control={control}
          size="small"
          name="description"
          label="Descripción"
          required
          rules={{ required: 'Campo requerido' }}
          multiline
          rows={4}
        />
        <RadioButtonGroup
          control={control}
          name="storeId"
          label="Sucursal"
          required
          rules={{ required: 'Campo requerido' }}
          radioProps={{ size: 'small' }}
          options={[
            {
              id: '1',
              label: 'Veracruz',
            },
            {
              id: '9',
              label: 'Manzanillo',
            },
            {
              id: '2',
              label: 'México',
            },
            {
              id: '0',
              label: 'Todas',
            },
          ]}
          row
        />
      </form>
    </MuiSimpleModal>
  );
};

