import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useContacts, usePayments, useWeekContext } from '../hooks';

import { AutocompleteInput } from '../../core/components/inputs/AutocompleteInput';
import { FaCheck } from 'react-icons/fa';
import NumberInput from '../../core/components/inputs/NumberInput';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { TextInput } from '../../core/components/inputs/TextInput';
import { daysSelection } from '../utils/day-selection-items';
import toast from 'react-hot-toast';
import { useDebounce } from '../../core/hooks';
import { useNavigate } from 'react-router-dom';
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

const NewPaymentForm = () => {
  const navigate = useNavigate();
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

  const onClose = () => {
    navigate('/reportes/balance/payment');
  };

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

export default NewPaymentForm;
