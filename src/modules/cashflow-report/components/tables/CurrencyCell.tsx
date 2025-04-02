import type { DaysOfWeek, WeekBase } from '../../models';

import AmountDetailDialog from '../AmountDetailDialog';
import ConfirmDialog from '../ConfirmDialog';
import { formatCurrency } from '@/utilities';
import { useState } from 'react';

interface CurrencyCellProps {
  value: number | string;
  confirmationRequired?: boolean;
  type?: "collect" | "payment";
  item?: WeekBase & { id: number };
  dayOfWeek?: DaysOfWeek;
  customColor?: string;
}

const CurrencyCell = (props: CurrencyCellProps) => {
  const { value, customColor, type, dayOfWeek, item } = props;

  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item || !dayOfWeek) return;

    if (item[dayOfWeek].confirmed) {
      setOpenDetails(true);
      return;
    }

    if (!props.confirmationRequired) return;
    setOpen(true);
  };

  return (
    <>
      <span
        className={`inline-block py-0.5 px-1 rounded text-xs font-bold text-right select-none cursor-pointer`}
        style={{ backgroundColor: customColor || "#f0f8ff", color: "#333" }}
        onDoubleClick={handleDoubleClick}
      >
        {formatCurrency(value || 0)}
      </span>

      {open && item && type && dayOfWeek && (
        <ConfirmDialog
          onClose={() => setOpen(false)}
          item={item}
          type={type}
          dayOfWeek={dayOfWeek}
        />
      )}

      {openDetails && item && dayOfWeek && (
        <AmountDetailDialog
          onClose={() => setOpenDetails(false)}
          amount={item[dayOfWeek]}
        />
      )}
    </>
  );
};

export default CurrencyCell;

