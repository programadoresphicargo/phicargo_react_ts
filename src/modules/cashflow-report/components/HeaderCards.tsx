import { useCollectRegisters, usePayments } from '../hooks';

import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { formatCurrency } from '@/utilities';
import { getProjection } from '../utils';

const HeaderCards = () => {
  const {
    collectRegisterQuery: { data: registers, isFetching: loadingCollect },
  } = useCollectRegisters();

  const {
    paymentsQuery: { data: payments, isFetching: loadingPayments },
  } = usePayments();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <IndicatorCard
        title="Total Cobrado"
        classNames={{
          title: 'text-gray-300 text-center font-bold text-sm m-0',
          content:
            'text-emerald-400 text-center font-bold text-medium m-0 transition-colors duration-300',
        }}
        content={
          loadingCollect
            ? 'Cargando...'
            : formatCurrency(
                (registers || []).reduce(
                  (acc, curr) => acc + curr.totalConfirmed,
                  0,
                ),
              )
        }
      />
      <IndicatorCard
        title="Proyección de Cobro"
        classNames={{
          title: 'text-gray-300 text-center font-bold text-sm m-0',
          content:
            'text-emerald-400 text-center font-bold text-medium m-0 transition-colors duration-300',
        }}
        content={
          loadingCollect
            ? 'Cargando...'
            : formatCurrency(
                (registers || []).reduce(
                  (acc, curr) => acc + getProjection(curr),
                  0,
                ),
              )
        }
      />
      <IndicatorCard
        title="Total Pagado"
        classNames={{
          title: 'text-gray-300 text-center font-bold text-sm m-0',
          content:
            'text-emerald-400 text-center font-bold text-medium m-0 transition-colors duration-300',
        }}
        content={
          loadingPayments
            ? 'Cargando...'
            : formatCurrency(
                (payments || []).reduce(
                  (acc, curr) => acc + curr.totalConfirmed,
                  0,
                ),
              )
        }
      />
      <IndicatorCard
        title="Proyección de Pago"
        classNames={{
          title: 'text-gray-300 text-center font-bold text-sm m-0',
          content:
            'text-emerald-400 text-center font-bold text-medium m-0 transition-colors duration-300',
        }}
        content={
          loadingCollect
            ? 'Cargando...'
            : formatCurrency(
                (payments || []).reduce(
                  (acc, curr) => acc + getProjection(curr),
                  0,
                ),
              )
        }
      />
    </div>
  );
};

export default HeaderCards;
