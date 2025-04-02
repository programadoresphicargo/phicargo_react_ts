import { DatePickerInput, SelectInput, TextInput } from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Dayjs } from 'dayjs';
import type { DriverUnavailabilityCreate } from '../../models';
import { SaveButton } from '@/components/ui';
import type { SelectItem } from '@/types';
import { SimpleModal } from '@/components';
import { useUnavailabilityQueries } from '../../hooks/queries';

interface Props {
  driverId: number;
  isOpen: boolean;
  onOpenChange: () => void;
}

const initialValues: DriverUnavailabilityCreate = {
  startDate: null as unknown as Dayjs,
  endDate: null as unknown as Dayjs,
  employeeId: null as unknown as number,
  reasonType: '',
  description: '',
};

const reasonOptions: SelectItem[] = [
  { key: 'vacaciones', value: 'VACACIONES' },
  { key: 'incapacidad', value: 'INCAPACIDAD' },
  { key: 'permiso', value: 'PERMISO' },
  { key: 'castigo', value: 'CASTIGO' },
  { key: 'incidencia-capacitacion', value: 'INCIDENCIA (CAPACITACIÓN)' },
];

const UnavailiabilityCreateModal = (props: Props) => {
  const { driverId, isOpen, onOpenChange } = props;

  const {
    driverUnavailabilityMutation: { mutate, isPending },
  } = useUnavailabilityQueries(driverId);

  const { control, handleSubmit } = useForm<DriverUnavailabilityCreate>({
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<DriverUnavailabilityCreate> = (data) => {
    data.employeeId = driverId;
    mutate(data, {
      onSettled: () => onOpenChange(),
    });
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      header={<h2 className="w-full">Crear Permiso / Castigo</h2>}
      customFooter={
        <SaveButton
          onPress={() => handleSubmit(onSubmit)()}
          fullWidth
          variant="flat"
          className="font-bold uppercase"
          isLoading={isPending}
        />
      }
    >
      <form className="flex flex-col gap-4">
        <SelectInput
          control={control}
          name="reasonType"
          label="Razón"
          rules={{ required: 'Este campo es requerido' }}
          items={reasonOptions}
        />
        <TextInput control={control} name="description" label="Detalles" />
        <DatePickerInput
          control={control}
          name="startDate"
          label="Fecha de inicio"
          rules={{ required: 'Este campo es requerido' }}
        />
        <DatePickerInput
          control={control}
          name="endDate"
          label="Fecha fin"
          rules={{ required: 'Este campo es requerido' }}
        />
      </form>
    </SimpleModal>
  );
};

export default UnavailiabilityCreateModal;
