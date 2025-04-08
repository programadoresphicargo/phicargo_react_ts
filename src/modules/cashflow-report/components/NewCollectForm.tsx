import {
  AutocompleteInput,
  NumberInput,
  SelectInput,
} from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCollectRegisters, useContacts, useWeekContext } from '../hooks';

import { Button } from '@heroui/react';
import { Modal } from '@/components';
import { SaveButton } from '@/components/ui';
import { daysSelection } from '../utils/day-selection-items';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks';
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

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewCollectForm = ({ open, onClose }: Props) => {
  const { activeWeekId, companySelected } = useWeekContext();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { control, handleSubmit, reset } = useForm<OptionsSelection>({
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
    if (!activeWeekId || !companySelected) {
      toast.error('No hay una semana activa');
    }
    createRegister(
      {
        weekId: Number(activeWeekId),
        clientId: Number(data.clientId),
        mount: Number(data.mount),
        day: data.day,
        companyId: companySelected,
      },
      {
        onSuccess: () => {
          onClose();
          reset(initialFormState);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={onClose}
      header={<h3 className="font-bold text-xl uppercase">Nuevo Registro</h3>}
      customFooter={
        <>
          <Button color="default" variant="light" size="sm" onPress={onClose}>
            Cerrar
          </Button>
          <SaveButton
            color="primary"
            size="sm"
            variant="flat"
            className="font-bold"
            radius="full"
            isLoading={isPending}
            onPress={() => handleSubmit(onSubmit)()}
          />
        </>
      }
    >
      <form className="flex flex-col gap-4 m-2">
        <AutocompleteInput
          control={control}
          name="clientId"
          label="Cliente"
          items={ContactsSelection || []}
          variant="bordered"
          isLoading={isFetching}
          searchInput={searchTerm}
          setSearchInput={setSearchTerm}
          rules={{ required: 'Cliente obligatorio' }}
        />
        <SelectInput
          control={control}
          name="day"
          label="Día"
          variant="bordered"
          items={daysSelection}
          rules={{ required: 'Día obligatorio' }}
        />
        <NumberInput
          control={control}
          name="mount"
          label="Monto"
          variant="bordered"
          endContent="$"
          rules={{ required: 'Ingresa un monto' }}
        />
      </form>
    </Modal>
  );
};

export default NewCollectForm;

