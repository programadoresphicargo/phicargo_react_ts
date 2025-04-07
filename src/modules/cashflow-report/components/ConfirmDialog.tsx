import { CheckboxInput, NumberInput } from '@/components/inputs';
import type { DaysOfWeek, WeekBase } from '../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCollectRegisters, usePayments } from '../hooks';

import { Button } from '@heroui/react';
import { FaCheck } from 'react-icons/fa';
import { IoIosAlert } from 'react-icons/io';
import { SimpleModal } from '@/components';

interface Confirmation {
  totalAmount: boolean;
  realAmount: number;
}

const formInitialState: Confirmation = {
  totalAmount: true,
  realAmount: 0,
};

interface Props {
  open: boolean;
  onClose: () => void;
  item: WeekBase & { id: number };
  type: 'collect' | 'payment';
  dayOfWeek: DaysOfWeek;
}

const ConfirmDialog = (props: Props) => {
  const { open, onClose, item, type, dayOfWeek } = props;

  const {
    confirmCollectMutation: { mutate: confirmCollect },
  } = useCollectRegisters();

  const {
    confirmPaymentMutation: { mutate: confirmPayment },
  } = usePayments();

  const { control, handleSubmit, watch, reset } = useForm<Confirmation>({
    defaultValues: formInitialState,
  });

  const totalAmount = watch('totalAmount');

  const onCloseModal = () => {
    onClose();
    reset(formInitialState);
  };

  const onSubmit: SubmitHandler<Confirmation> = (data) => {
    const confirmation = {
      itemId: item.id,
      dayOfWeek: dayOfWeek,
      confirmed: true,
      amount: data.totalAmount ? item[dayOfWeek].amount : data.realAmount,
    };

    if (type === 'collect') {
      confirmCollect(confirmation);
    } else {
      confirmPayment(confirmation);
    }
    onClose();
  };

  return (
    <>
      <SimpleModal
        isOpen={open}
        onOpenChange={onCloseModal}
        header={
          <div className="flex items-center gap-2">
            <IoIosAlert className="text-4xl text-yellow-500" />
            <h3 className="font-bold text-xl uppercase">Confirmar</h3>
          </div>
        }
        customFooter={
          <>
            <Button
              color="default"
              variant="light"
              size="sm"
              onPress={onCloseModal}
            >
              Cerrar
            </Button>
            <Button
              color="primary"
              onPress={() => handleSubmit(onSubmit)()}
              size="sm"
              radius="full"
              className="uppercase font-bold"
              startContent={<FaCheck />}
            >
              Completar
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4 m-2">
          <div className="flex items-center justify-center">
            <CheckboxInput
              control={control}
              name="totalAmount"
              label="Monto Total"
            />
          </div>
          <NumberInput
            control={control}
            name="realAmount"
            label="Monto a Confirmar"
            rules={
              totalAmount
                ? {}
                : {
                    min: {
                      value: 1,
                      message: 'La cantidad debe de ser mayor a 0',
                    },
                  }
            }
            isDisabled={totalAmount}
          />
        </form>
      </SimpleModal>
    </>
  );
};

export default ConfirmDialog;

