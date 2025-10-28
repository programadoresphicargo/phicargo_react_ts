import dayjs from 'dayjs';
import {
  InspectionType,
  VehicleInspectionCreate,
  VehicleInspectionQuestionCreate,
} from '../../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  TextareaAutosizeElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { DatePickerElement } from 'react-hook-form-mui/date-pickers';
import { MuiSaveButton } from '@/components/ui';
import { DriverAutocompleteInput } from '@/modules/drivers/components/DriverAutocompleteInput';
import { useCreateVehicleInspectionMutation } from '../../hooks/mutations';
import { Button } from '@heroui/react';
import { useEffect } from 'react';
import { Select, SelectItem } from "@heroui/react";
import { Controller } from "react-hook-form";

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

  useEffect(() => {
    if (!checklist) return;

    const answer0 = checklist[0]?.answer;
    const answer1 = checklist[1]?.answer;

    if (answer0 === 'si' || answer1 === 'no') {
      setValue('result', 'rejected', { shouldValidate: true });
    } else if (answer0 === 'no' || answer1 === 'si') {
      setValue('result', 'approved', { shouldValidate: true });
    } else {
      // Si no hay respuestas válidas, asegura mantener el valor actual o default
      const currentResult = watch('result');
      if (!currentResult) {
        setValue('result', 'approved', { shouldValidate: true });
      }
    }
    // ⚠️ Quitamos `result` de dependencias para evitar loops
  }, [checklist, setValue, watch]);

  const onSubmit: SubmitHandler<VehicleInspectionCreate> = (data) => {
    if (!vehicleId) return;
    if (inspectionType) {
      data.inspectionType = inspectionType;
    }

    console.log('Checklist recibido:', checklist);
    console.log('Datos del formulario:', data);

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
      <Controller
        control={control}
        name="result"
        rules={{ required: 'Resultado de la revisión requerido' }}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            label="Resultado de la Revisión"
            variant="bordered"
            placeholder="Selecciona un resultado"
            isRequired
            selectedKeys={[field.value]} // HeroUI usa selectedKeys en lugar de value
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              field.onChange(value);
            }}
            color={fieldState.invalid ? "danger" : "default"}
            errorMessage={fieldState.error?.message}
            // si quieres hacerlo solo lectura:
            isDisabled
          >
            <SelectItem key="approved">Aprobado</SelectItem>
            <SelectItem key="rejected">Rechazado</SelectItem>
          </Select>
        )}
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
          <Controller
            control={control}
            name="driverId"
            rules={{ required: "Operador requerido" }}
            render={({ field }) => (
              <DriverAutocompleteInput
                control={control}   // sigue siendo necesario
                name={field.name}
                label="Operador"
                setValue={setValue}
              />
            )}
          />
        </>
      )}

      <div className="flex justify-between items-center">
        {onCancel && (
          <Button
            radius='full'
            color="danger"
            size="sm"
            onPress={onCancel}
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

