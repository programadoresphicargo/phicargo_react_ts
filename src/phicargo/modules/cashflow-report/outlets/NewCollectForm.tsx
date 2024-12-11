import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCollectRegisters, useContacts, useWeekContext } from '../hooks';

import { AutocompleteInput } from '../../core/components/inputs/AutocompleteInput';
import { FaCheck } from 'react-icons/fa';
import NumberInput from '../../core/components/inputs/NumberInput';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { daysSelection } from '../utils/day-selection-items';
import toast from 'react-hot-toast';
import { useDebounce } from '../../core/hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface OptionsSelection {
  clientId: number;
  mount: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
}

const initialFormState: OptionsSelection = {
  clientId: '' as unknown as number,
  mount: '' as unknown as number,
  day: '' as unknown as OptionsSelection['day'],
};

const NewCollectForm = () => {
  const navigate = useNavigate();
  const { activeWeekId } = useWeekContext();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { control, handleSubmit } = useForm<OptionsSelection>({
    defaultValues: initialFormState,
  });

  const {
    searchContactByNameQuery: { isFetching },
    ContactsSelection,
  } = useContacts({ name: debouncedSearchTerm });

  const {
    createCollectRegisterMutation: { mutate: createRegister, isPending },
  } = useCollectRegisters();

  const onSubmit: SubmitHandler<OptionsSelection> = (data) => {
    if (!activeWeekId) {
      toast.error('No hay una semana activa');
    }
    createRegister({
      weekId: Number(activeWeekId),
      clientId: Number(data.clientId),
      mount: Number(data.mount),
      day: data.day,
    });
  };

  const onClose = () => {
    navigate('/reportes/balance/collect');
  };

  return (
    <Modal isOpen={true} size="md" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 pb-2 bg-[#dadfeb]">
              <h3 className="font-bold text-xl text-gray-800 uppercase">
                Nuevo Registro
              </h3>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <AutocompleteInput
                control={control}
                name="clientId"
                label="Cliente"
                items={ContactsSelection || []}
                isLoading={isFetching}
                searchInput={searchTerm}
                setSearchInput={setSearchTerm}
                rules={{ required: 'Cliente obligatorio' }}
              />
              <SelectInput
                control={control}
                name="day"
                label="Día"
                items={daysSelection}
                rules={{ required: 'Día obligatorio' }}
              />
              <NumberInput
                control={control}
                name="mount"
                label="Monto"
                endContent="$"
                rules={{ required: 'Ingresa un monto' }}
              />
            </ModalBody>
            <ModalFooter className="flex justify-end">
              <Button
                color="primary"
                onClick={handleSubmit(onSubmit)}
                size="sm"
                className="uppercase font-bold"
                startContent={<FaCheck />}
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

export default NewCollectForm;
