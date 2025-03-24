import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';

import { Button } from '@heroui/react';
import CheckIcon from '@mui/icons-material/Check';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import type { MaintenanceRecordStatus } from '../models';
import { SelectElement } from 'react-hook-form-mui';
import { SimpleModal } from '@/components';
import { useMaintenanceRecord } from '../hooks';

interface RegisterDetailForm {
  status: MaintenanceRecordStatus;
  checkOut: Dayjs;
}

const initialFormValues: RegisterDetailForm = {
  status: 'completed',
  checkOut: dayjs(),
};

interface CompleteDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
}

const CompleteDialog = (props: CompleteDialogProps) => {
  const { open, onClose, itemId } = props;

  const {
    editRecordMutation: { mutate: editRegister, isPending },
  } = useMaintenanceRecord();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initialFormValues,
  });

  const onSubmit: SubmitHandler<RegisterDetailForm> = (data) => {
    editRegister(
      {
        id: itemId,
        updatedItem: { status: data.status, checkOut: data.checkOut },
      },
      {
        onSuccess: () => {
          reset(initialFormValues);
          onClose();
        },
      },
    );
  };

  return (
    <SimpleModal
      isOpen={open}
      onClose={onClose}
      header={<h2 className="text-center">Completar Registro</h2>}
      customFooter={
        <>
          <Button
            color="danger"
            radius="full"
            variant="light"
            size="sm"
            onPress={onClose}
          >
            Cerrar
          </Button>
          <Button
            color="success"
            radius="full"
            startContent={<CheckIcon sx={{ fontSize: '1.2rem' }} />}
            className="uppercase font-bold text-gray-800"
            size="sm"
            onPress={() => handleSubmit(onSubmit)()}
            isLoading={isPending}
          >
            Completar
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-6 py-4 px-2">
        <SelectElement
          control={control}
          name="status"
          label="Estatus"
          size="small"
          required
          options={[
            { label: 'Completado', id: 'completed' },
            { label: 'Pendiente', id: 'pending' },
            { label: 'Cancelado', id: 'cancelled' },
          ]}
          rules={{ required: 'Este campo es requerido' }}
        />

        <DatePickerElement
          control={control}
          name="checkOut"
          label="Fecha de Salida"
          inputProps={{ size: 'small' }}
          required
          rules={{ required: 'Este campo es requerido' }}
        />
      </form>
    </SimpleModal>
  );
};

export default CompleteDialog;
