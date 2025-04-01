import { formatCurrency } from '@/utilities';

interface Props {
  value: number | string;
  isPositive?: boolean;
  isNegative?: boolean;
  isWarning?: boolean;
}

export const CurrencyCell = (props: Props) => {
  const { value } = props;

  const numericValue = Number(value);

  const isPositive = props.isPositive ?? numericValue > 0;
  const isNegative = props.isNegative ?? numericValue <= 0;
  const isWarning = props.isWarning ?? false;

  return (
    <span
      className={`
        px-2 py-1 rounded font-semibold text-medium font-mono
        ${isWarning ? 'text-orange-700 bg-orange-50' : ''}
        ${!isWarning && isPositive ? 'text-green-700 bg-green-50' : ''}
        ${!isWarning && isNegative ? 'text-red-700 bg-red-50' : ''}
        ${!isWarning && !isPositive && !isNegative ? 'text-gray-500' : ''}
      `}
    >
      {formatCurrency(value)}
    </span>
  );
};

