import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { SubmitHandler, useForm } from 'react-hook-form';

import { MdOutlineArchive } from 'react-icons/md';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import type { ShiftArchive } from '../models';
import { useShiftQueries } from '../hooks/useShiftQueries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shiftId: number;
}

const initialState: ShiftArchive = {
  reason: '',
};

export const ArchiveDialog = ({ isOpen, onClose, shiftId }: Props) => {
  const { archiveShift } = useShiftQueries();

  const { control, handleSubmit } = useForm({
    defaultValues: initialState,
  });

  const onSubmit: SubmitHandler<ShiftArchive> = (data) => {
    if (!shiftId) {
      return;
    }
    archiveShift.mutate(
      {
        id: shiftId,
        updatedItem: data,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="sm">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-center bg-[#dadfeb] pb-2">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Archivar turno
              </h3>
            </ModalHeader>
            <ModalBody className="p-2">
              <div>
                <SelectInput
                  control={control}
                  label="Razón"
                  name="reason"
                  items={[
                    { key: 'VIAJE ASIGNADO', value: 'VIAJE ASIGNADO' },
                    { key: 'TURNO REPETIDO', value: 'TURNO REPETIDO' },
                    {
                      key: 'ARCHIVADO SIN ASIGNAR',
                      value: 'ARCHIVADO SIN ASIGNAR',
                    },
                    {
                      key: 'OPERADOR DE ENGANCHE',
                      value: 'OPERADOR DE ENGANCHE',
                    },
                  ]}
                  rules={{ required: 'Este campo es requerido' }}
                />
              </div>
              <Button
                color="primary"
                onPress={() => handleSubmit(onSubmit)()}
                startContent={<MdOutlineArchive />}
                isLoading={archiveShift.isPending}
              >
                Archivar
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

