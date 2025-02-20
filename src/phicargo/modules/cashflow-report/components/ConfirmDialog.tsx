import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import type { DaysOfWeek, WeekBase } from '../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCollectRegisters, usePayments } from '../hooks';

import { CheckboxInput } from '../../core/components/inputs/CheckboxInput';
import { FaCheck } from 'react-icons/fa';
import { IoIosAlert } from 'react-icons/io';
import NumberInput from '../../core/components/inputs/NumberInput';

interface Confirmation {
  totalAmount: boolean;
  realAmount: number;
}

const formInitialState: Confirmation = {
  totalAmount: true,
  realAmount: 0,
};

interface ConfirmDialogProps {
  onClose: () => void;
  item: WeekBase & { id: number };
  type: 'collect' | 'payment';
  dayOfWeek: DaysOfWeek;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { onClose, item, type, dayOfWeek } = props;

  const {
    confirmCollectMutation: { mutate: confirmCollect },
  } = useCollectRegisters();

  const {
    confirmPaymentMutation: { mutate: confirmPayment },
  } = usePayments();

  const { control, handleSubmit, watch } = useForm<Confirmation>({
    defaultValues: formInitialState,
  });

  const totalAmount = watch('totalAmount');

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
      <Modal isOpen={true} size="xs" onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2 pb-2 bg-[#dadfeb]">
                <IoIosAlert className="text-4xl text-yellow-500" />
                <h3 className="font-bold text-xl text-gray-800 uppercase">
                  Confirmar
                </h3>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-4">
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
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  size="sm"
                  className="uppercase font-bold"
                  startContent={<FaCheck />}
                  // isLoading={isPending}
                >
                  Completar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmDialog;
