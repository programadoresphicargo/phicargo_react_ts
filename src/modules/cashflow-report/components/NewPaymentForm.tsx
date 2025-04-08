import {
  AutocompleteInput,
  NumberInput,
  SelectInput,
  TextInput,
} from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useContacts, usePayments, useWeekContext } from '../hooks';

import { Button } from '@heroui/react';
import { Modal } from '@/components';
import { SaveButton } from '@/components/ui';
import { daysSelection } from '../utils/day-selection-items';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks';
import { useState } from 'react';

interface OptionsSelection {
  providerId: string | number;
  concept: string;
  amount: number;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
}

const initialFormState: OptionsSelection = {
  providerId: '',
  concept: '',
  amount: '' as unknown as number,
  day: '' as unknown as OptionsSelection['day'],
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewPaymentForm = ({ open, onClose }: Props) => {
  const { activeWeekId, companySelected } = useWeekContext();
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
    createPaymentMutation: { mutate: createRegister, isPending },
  } = usePayments();

  const onSubmit: SubmitHandler<OptionsSelection> = (data) => {
    if (!activeWeekId || !companySelected) {
      toast.error('No hay una semana activa');
    }
    const newPayment = {
      weekId: Number(activeWeekId),
      providerId: Number(data.providerId),
      concept: data.concept,
      day: data.day,
      amount: Number(data.amount),
      companyId: companySelected,
    };
    createRegister(newPayment, {
      onSuccess: () => onClose(),
    });
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
          name="providerId"
          label="Proveedor"
          items={ContactsSelection || []}
          isLoading={isFetching}
          searchInput={searchTerm}
          setSearchInput={setSearchTerm}
          rules={{ required: 'Provedor obligatorio' }}
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
          name="amount"
          label="Monto"
          endContent="$"
          rules={{ required: 'Monto Obligatorio' }}
        />
        <TextInput
          control={control}
          label="Concepto"
          name="concept"
          rules={{ required: 'Concepto Obligatorio' }}
        />
      </form>
    </Modal>
  );
};

export default NewPaymentForm;

