import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import type { Amount } from '../models';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { formatCurrency } from '../utils';

interface AmountDetailDialogProps {
  onClose: () => void;
  amount: Amount;
}

const AmountDetailDialog = (props: AmountDetailDialogProps) => {
  const { onClose, amount } = props;

  return (
    <Modal isOpen={true} size="xs" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 pb-2 bg-[#dadfeb]">
              <MdOutlineAttachMoney className="text-4xl text-green-800" />
              <h3 className="font-bold text-xl text-gray-800 uppercase">
                Detalles
              </h3>
            </ModalHeader>
            <ModalBody>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left border border-gray-300">
                      Descripción
                    </th>
                    <th className="p-2 text-left border border-gray-300">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-300">Proyectado</td>
                    <td className="p-2 border border-gray-300">
                      {formatCurrency(amount.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300">Confirmado</td>
                    <td className="p-2 border border-gray-300">
                      {formatCurrency(amount.realAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </ModalBody>
            <ModalFooter className="flex justify-end">
              <Button
                color="primary"
                onClick={onClose}
                size="sm"
                className="uppercase font-bold"
                startContent={<FaCheck />}
              >
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AmountDetailDialog;
