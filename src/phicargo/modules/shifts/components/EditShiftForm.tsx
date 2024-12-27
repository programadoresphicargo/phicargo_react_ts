import { Shift, ShiftEdit } from '../models';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@nextui-org/react';
import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { DriverSearchInput } from '../../core/components/inputs/DriverSearchInput';
import { TextareaInput } from '../../core/components/inputs/TextareaInput';
import { VehicleSearchInput } from '../../core/components/inputs/VehicleSearchInput';
import dayjs from 'dayjs';
import { useShiftQueries } from '../hooks/useShiftQueries';

const initialValues: ShiftEdit = {
  vehicleId: null as unknown as number,
  driverId: null as unknown as number,
  arrivalAt: dayjs(),
  comments: '',
};

const trasnformShiftToEdit = (shift: Shift): ShiftEdit => ({
  vehicleId: shift.vehicle.id,
  driverId: shift.driver.id,
  arrivalAt: shift.arrivalAt,
  comments: shift.comments || '',
});

interface Props {
  shift?: Shift | null;
  enabled?: boolean;
}

export const EditShiftForm = ({ shift, enabled }: Props) => {
  const { control, handleSubmit, watch } = useForm<ShiftEdit>({
    defaultValues: shift ? trasnformShiftToEdit(shift) : initialValues,
  });

  const driverId = watch('driverId');
  const vehicleId = watch('vehicleId');

  const { editShift } = useShiftQueries();

  const onSubmit: SubmitHandler<ShiftEdit> = (data) => {
    if (!shift) {
      return;
    }
    editShift.mutate({
      id: shift.id,
      updatedItem: data,
    });
  };

  return (
    <>
      <VehicleSearchInput
        control={control}
        name="vehicleId"
        vehicleId={vehicleId}
        required
        isDisabled={!enabled}
      />
      <DriverSearchInput
        control={control}
        name="driverId"
        driverId={driverId}
        required
        isDisabled={!enabled}
      />
      <DatePickerInput
        control={control}
        name="arrivalAt"
        label="Fecha de llegada"
        initialValue={shift?.arrivalAt}
        rules={{ required: 'Este campo es requerido' }}
        isDisabled={!enabled}
      />
      <TextareaInput
        control={control}
        name="comments"
        label="Comentarios"
        isUpperCase
        minRows={6}
        isDisabled={!enabled}
      />
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <div>
          <p>
            Creado por:{' '}
            <span className="font-medium">{shift?.registerUser.username}</span>
          </p>
          <p>
            Fecha de creación:{' '}
            <span className="font-medium">
              {shift?.registerDate.format('DD/MM/YYYY')}
            </span>
          </p>
        </div>
        <Button
          variant="flat"
          color="primary"
          onPress={() => handleSubmit(onSubmit)()}
          isDisabled={!enabled}
        >
          Guardar
        </Button>
      </div>
    </>
  );
};

