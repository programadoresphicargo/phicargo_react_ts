import { formatCurrency } from '@/utilities';

interface Props {
  value: number | string;
}

export const CurrencyCell = ({ value }: Props) => {
  const isPositive = Number(value) > 0;
  const isNegative = Number(value) < 0;

  return (
    <span
      className={`
                   px-2 py-1 rounded 
                   ${isPositive ? 'text-green-700 bg-green-50' : ''}
                   ${isNegative ? 'text-red-700 bg-red-50' : ''}
                   ${!isPositive && !isNegative ? 'text-gray-500' : ''}
                   font-semibold text-medium font-mono
                 `}
    >
      {formatCurrency(value)}
    </span>
  );
};

