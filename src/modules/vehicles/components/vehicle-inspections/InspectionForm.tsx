import dayjs from 'dayjs';
import {
  InspectionType,
  VehicleInspectionCreate,
  VehicleInspectionQuestionCreate,
} from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  SelectElement,
  TextareaAutosizeElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { Button, MuiSaveButton } from '@/components/ui';
import { DriverAutocompleteInput } from '@/modules/drivers/components/DriverAutocompleteInput';
import { useCreateVehicleInspectionMutation } from '../../hooks/mutations';

const initialValues: VehicleInspectionCreate = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vehicleId: null as any,
  inspectionDate: dayjs(),
  result: 'approved',
  comments: '',
  driverId: null,
  inspectionType: 'cleaning',
  checklist: [],
  userPin: '',
  inspectionState: 'draft',
  confirmedDate: dayjs(),
};

interface Props {
  vehicleId: number;
  inspectionType?: InspectionType;
  onCancel?: () => void;
  onSuccess?: () => void;
  checklist?: VehicleInspectionQuestionCreate[];
}

export const InspectionForm = ({
  vehicleId,
  inspectionType,
  onCancel,
  onSuccess,
  checklist,
}: Props) => {
  const { mutation } = useCreateVehicleInspectionMutation();

  const { control, handleSubmit, watch, setValue } =
    useForm<VehicleInspectionCreate>({
      defaultValues: initialValues,
    });

  const result = watch('result');

  const onSubmit: SubmitHandler<VehicleInspectionCreate> = (data) => {
    if (!vehicleId) return;
    if (inspectionType) {
      data.inspectionType = inspectionType;
    }
    mutation.mutate(
      {
        ...data,
        vehicleId,
        checklist: checklist || [],
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  const minInspectionDate = dayjs().startOf('month');

  return (
    <form className="flex flex-col gap-4" noValidate>
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

      <TextareaAutosizeElement
        control={control}
        name="comments"
        label="Comentarios"
        minRows={3}
        required={result === 'rejected'}
        rules={
          result === 'rejected' ? { required: 'Comentario requerido' } : {}
        }
      />

      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start'>
        <DatePickerElement
          control={control}
          name="inspectionDate"
          label="Fecha de Inspección"
          disableFuture
          minDate={minInspectionDate}
          displayWeekNumber
          required
          rules={{ required: 'Fecha de inspección requerida' }}
          inputProps={{ size: 'small', fullWidth: true }}
        />

        <TextFieldElement
          control={control}
          name="userPin"
          label="PIN del Usuario"
          size="small"
          fullWidth
          type="password"
          required
          rules={{
            required: 'PIN del usuario requerido',
            pattern: {
              value: /^\d{4}$/,
              message: 'El PIN debe ser exactamente 4 dígitos numéricos',
            },
          }}
        />
      </div>

      {result === 'rejected' && (
        <>
          <DriverAutocompleteInput
            control={control}
            name="driverId"
            label="Operador"
            required
            rules={{ required: 'Operador requerido' }}
            setValue={setValue}
          />
        </>
      )}

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
          loading={mutation.isPending}
        />
      </div>
    </form>
  );
};

