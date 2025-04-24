import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';

import { Button } from '@/components/ui';
import CheckIcon from '@mui/icons-material/Check';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import type { MaintenanceRecordStatus } from '../models';
import { MuiSimpleModal } from '@/components';
import { SelectElement } from 'react-hook-form-mui';
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
    <MuiSimpleModal
      open={open}
      onClose={onClose}
      disableEnforceFocus
      header={<h2 className="text-center">Completar Registro</h2>}
      customFooter={
        <>
          <Button
            color="error"
            variant="text"
            size="small"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            color="success"
            variant="contained"
            startIcon={<CheckIcon sx={{ fontSize: '1.2rem' }} />}
            size="small"
            onClick={() => handleSubmit(onSubmit)()}
            loading={isPending}
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
          slotProps={{
            select: {
              MenuProps: {
                disablePortal: true,
              }
            }
          }}
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
    </MuiSimpleModal>
  );
};

export default CompleteDialog;
