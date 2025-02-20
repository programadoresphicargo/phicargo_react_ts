import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { SubmitHandler, useForm } from 'react-hook-form';

import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { Dayjs } from 'dayjs';
import { DriverUnavailabilityCreate } from '../models/driver-unavailability';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { SelectItem } from '../../core/types/global-types';
import { TextInput } from '../../core/components/inputs/TextInput';
import { useUnavailabilityQueries } from '../hooks/useUnavailabilityQueries';

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
];

const UnavailiabilityCreateModal = (props: Props) => {
  const { driverId, isOpen, onOpenChange } = props;

  const {
    driverUnavailabilityMutation: { mutate, isPending },
  } = useUnavailabilityQueries({ driverId: driverId });

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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Agregar Permiso
            </ModalHeader>
            <ModalBody>
              <SelectInput
                control={control}
                name="reasonType"
                label="Razón"
                rules={{ required: 'Este campo es requerido' }}
                items={reasonOptions}
              />
              <TextInput
                control={control}
                name="description"
                label="Detalles"
              />
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmit)}
                isLoading={isPending}
              >
                Crear
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UnavailiabilityCreateModal;
