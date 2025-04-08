import type { Amount } from '../models';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { SimpleModal } from '@/components';
import { formatCurrency } from '@/utilities';

interface AmountDetailDialogProps {
  open: boolean;
  onClose: () => void;
  amount: Amount;
}

const AmountDetailDialog = (props: AmountDetailDialogProps) => {
  const { open, onClose, amount } = props;

  return (
    <SimpleModal
      isOpen={open}
      onOpenChange={onClose}
      header={
        <div className="flex items-center gap-2">
          <MdOutlineAttachMoney className="text-4xl text-green-800" />
          <h3 className="font-bold text-xl uppercase">Detalles</h3>
        </div>
      }
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left border border-gray-300">
              Descripción
            </th>
            <th className="p-2 text-left border border-gray-300">Cantidad</th>
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
    </SimpleModal>
  );
};

export default AmountDetailDialog;

