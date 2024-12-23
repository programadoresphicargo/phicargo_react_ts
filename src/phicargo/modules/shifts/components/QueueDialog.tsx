import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { HiQueueList } from 'react-icons/hi2';
import { QueueCreate } from '../models';
import { TextareaInput } from '../../core/components/inputs/TextareaInput';
import dayjs from 'dayjs';
import { useShiftQueueQueries } from '../hooks/useShiftQueueQueries';
import { useState } from 'react';

const initialState: QueueCreate = {
  enqueueDate: dayjs(),
  releaseDate: dayjs(),
  comments: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shiftId: number;
}

export const QueueDialog = ({ isOpen, onClose, shiftId }: Props) => {
  const [releaseNextDay, setReleaseNextDay] = useState(true);
  const { createQueue } = useShiftQueueQueries();

  const { control, handleSubmit } = useForm({
    defaultValues: initialState,
  });

  const onSubmit: SubmitHandler<QueueCreate> = async (data) => {
    if (!shiftId) return;
    console.log(data);
    if (releaseNextDay) {
      data.releaseDate = dayjs().add(1, 'day').hour(9).minute(0).second(0);
    } else {
      data.releaseDate = dayjs(data.releaseDate).hour(9).minute(0).second(0);
    }

    createQueue.mutate({
      shiftId: shiftId,
      queueData: data,
    }, {
      onSuccess: () => {
        onClose();
      },
    });
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
            <ModalBody className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Checkbox
                    isSelected={releaseNextDay}
                    onValueChange={setReleaseNextDay}
                  >
                    Salida a las 9:00 AM
                  </Checkbox>
                  <p className="text-sm text-gray-500 italic">
                    El operador reingresa a la lista de turnos a las 9:00 AM del
                    día hábil siguiente.
                  </p>
                </div>
                {!releaseNextDay && (
                  <DatePickerInput
                    control={control}
                    name="releaseDate"
                    label="Fecha de liberación"
                  />
                )}
                <TextareaInput
                  control={control}
                  name="comments"
                  label="Comentarios"
                  placeholder="Escribe un comentario"
                  isUpperCase
                />
              </div>
              <Button
                color="primary"
                onPress={() => handleSubmit(onSubmit)()}
                startContent={
                  <HiQueueList style={{ transform: 'rotate(180deg)' }} />
                }
                isLoading={createQueue.isPending}
              >
                Enviar a cola
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

