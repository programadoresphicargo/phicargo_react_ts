import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';

import { Button } from '@/components/ui';
import CheckIcon from '@mui/icons-material/Check';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import type { MaintenanceRecordStatus } from '../models';
import { MuiSimpleModal } from '@/components';
import { useMaintenanceRecord } from '../hooks';

interface RegisterDetailForm {
  status: MaintenanceRecordStatus;
  checkIn: Dayjs;
}

const initialFormValues: RegisterDetailForm = {
  status: 'pending',
  checkIn: dayjs(),
};

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
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
        updatedItem: { status: data.status, checkIn: data.checkIn },
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
      header={<h2 className="text-center">Confirmar reporte</h2>}
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
            Confirmar
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-6 py-4 px-2">
        <DatePickerElement
          control={control}
          name="checkIn"
          label="Fecha de ingreso"
          inputProps={{ size: 'small' }}
          required
          rules={{ required: 'Este campo es requerido' }}
        />
      </form>
    </MuiSimpleModal>
  );
};

export default ConfirmDialog;
