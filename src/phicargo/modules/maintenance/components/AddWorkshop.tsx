import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { SubmitHandler, useForm } from 'react-hook-form';

import AddButton from '../../core/components/ui/AddButton';
import { TextInput } from '../../core/components/inputs/TextInput';
import { WorkshopCreate } from '../models';
import { useWorkshop } from '../hooks';

const initialFormValues: WorkshopCreate = {
  name: '',
};

interface AddWorkshopProps {
  onClose: () => void;
}

const AddWorkshop = (props: AddWorkshopProps) => {
  const { onClose } = props;

  const { control, handleSubmit } = useForm<WorkshopCreate>({
    defaultValues: initialFormValues,
  });

  const {
    addWorkshopMutation: { mutate: addWorkshop, isPending },
  } = useWorkshop();

  const onSubmit: SubmitHandler<WorkshopCreate> = (data) => {
    addWorkshop(data);
  };

  return (
    <>
      <Modal isOpen={true} size={'sm'} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
                <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                  Crear Nuevo Taller
                </h3>
              </ModalHeader>
              <ModalBody>
                <TextInput
                  control={control}
                  name="name"
                  label="Nombre del Taller"
                  rules={{ required: 'Este campo es requerido' }}
                  isUpperCase
                />
              </ModalBody>
              <ModalFooter>
                <AddButton
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isPending}
                  label="Crear Taller"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddWorkshop;
