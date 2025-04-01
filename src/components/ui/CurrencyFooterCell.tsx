import { formatCurrency } from "@/utilities";

interface Props {
  value: number | string;
}

export const CurrencyFooterCell = ({ value }: Props) => {
  return (
    <div className="p-1 border-t-2 border-t-gray-300 text-lg text-left font-bold">
      <p className="m-0">{formatCurrency(value)}</p>
    </div>
  );
};
