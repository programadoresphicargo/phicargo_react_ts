import dayjs from 'dayjs';
import { VehicleInspectionCreate } from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SelectElement, TextareaAutosizeElement } from 'react-hook-form-mui';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { Button, MuiSaveButton } from '@/components/ui';
import { DriverAutocompleteInput } from '@/modules/drivers/components/DriverAutocompleteInput';
import { useCreateVehicleInspectionMutation } from '../../hooks/mutations';
import { FileUploadInput } from '@/components/inputs';
import { useState } from 'react';

const initialValues: VehicleInspectionCreate = {
  vehicleId: 0,
  inspectionDate: dayjs(),
  result: 'approved',
  comments: '',
  driverId: null,
};

interface Props {
  vehicleId: number;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const InspectionForm = ({ vehicleId, onCancel, onSuccess }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const { mutation } = useCreateVehicleInspectionMutation();

  const { control, handleSubmit, watch, setValue } =
    useForm<VehicleInspectionCreate>({
      defaultValues: initialValues,
    });

  const result = watch('result');

  const onSubmit: SubmitHandler<VehicleInspectionCreate> = (data) => {
    if (!vehicleId) return;
    mutation.mutate(
      {
        data: {
          ...data,
          vehicleId,
        },
        files,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
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
          <div className="flex flex-col gap-4">
            <FileUploadInput
              files={files}
              setFiles={setFiles}
              acceptedFileTypes="image/jpeg, image/png"
              label="Adjuntar evidencias"
            />
          </div>
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

