import dayjs from 'dayjs';
import { VehicleInspectionCreate } from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SelectElement, TextareaAutosizeElement } from 'react-hook-form-mui';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { Button, MuiSaveButton } from '@/components/ui';

const initialValues: VehicleInspectionCreate = {
  vehicleId: 0,
  inspectionDate: dayjs(),
  result: 'approved',
  comments: '',
};

interface Props {
  vehicleId: number;
  onCancel?: () => void;
}

export const InspectionForm = ({ vehicleId, onCancel }: Props) => {
  const { control, handleSubmit, watch } = useForm<VehicleInspectionCreate>({
    defaultValues: initialValues,
  });

  const result = watch('result');

  const onSubmit: SubmitHandler<VehicleInspectionCreate> = (data) => {
    if (!vehicleId) return;
    console.log('Form submitted with data:', data);
  };

  return (
    <form className="flex flex-col gap-4">
      <SelectElement
        control={control}
        name="result"
        label="Resultado de la Revisión"
        size="small"
        required
        rules={{ required: 'Resultado de la revisión requerido' }}
        options={[
          { label: 'Aprobado', id: 'approved' },
          { label: 'Rechazado', id: 'rejected' },
        ]}
      />

      <DatePickerElement
        control={control}
        name="inspectionDate"
        label="Fecha de Inspección"
        disableFuture
        displayWeekNumber
        required
        rules={{ required: 'Fecha de inspección requerida' }}
        inputProps={{ size: 'small' }}
      />

      <TextareaAutosizeElement
        control={control}
        name="comments"
        label="Comentarios"
        minRows={6}
        required={result === 'rejected'}
        rules={
          result === 'rejected' ? { required: 'Comentario requerido' } : {}
        }
      />
      <div className="flex justify-between items-center">
        {onCancel && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <MuiSaveButton
          variant="contained"
          loadingPosition="end"
          onClick={handleSubmit(onSubmit)}
          // loading={isPending}
        />
      </div>
    </form>
  );
};

