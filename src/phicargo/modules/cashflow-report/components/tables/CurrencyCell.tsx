import { CSSProperties, useState } from "react";
import { DaysOfWeek, WeekBase } from "../../models";

import AmountDetailDialog from "../AmountDetailDialog";
import ConfirmDialog from "../ConfirmDialog";
import { formatCurrency } from "../../utils";

const style: CSSProperties = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "4px",
  color: "#333",
  fontSize: "14px",
  fontWeight: "bold",
  textAlign: "right",
  userSelect: "none",
  cursor: "pointer",
};

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
    };

    if (!props.confirmationRequired) return;
    setOpen(true);
  };

  return (
    <>
      <span 
        style={{
          ...style,
          backgroundColor: customColor || "#f0f8ff",
        }} 
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
