import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';

import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import type { MaintenanceRecordStatus } from '../models';
import { SelectInput } from '../../core/components/inputs/SelectInput';
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

  const { control, handleSubmit } = useForm({
    defaultValues: initialFormValues,
  });

  const onSubmit: SubmitHandler<RegisterDetailForm> = (data) => {
    editRegister({
      id: itemId,
      updatedItem: { status: data.status, checkOut: data.checkOut },
    });
  };

  return (
    <Modal isOpen={open} size={'sm'} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Completar Registro
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <SelectInput
                  control={control}
                  name="status"
                  label="Estatus"
                  items={[
                    { value: 'Completado', key: 'completed' },
                    { value: 'Pendiente', key: 'pending' },
                    { value: 'Cancelado', key: 'cancelled' },
                  ]}
                  rules={{ required: 'Este campo es requerido' }}
                />

                <DatePickerInput
                  control={control}
                  name="checkOut"
                  label="Fecha de Salida"
                  rules={{ required: 'Este campo es requerido' }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmit)}
                isLoading={isPending}
              >
                Completar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CompleteDialog;
