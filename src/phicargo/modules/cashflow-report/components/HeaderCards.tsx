import { formatCurrency, getProjection } from '../utils';
import { useCollectRegisters, usePayments } from '../hooks';

import { HeaderCard } from '../../core/components/ui/HeaderCard';

// import Card from './Card';


const HeaderCards = () => {
  const {
    collectRegisterQuery: { data: registers, isFetching: loadingCollect },
  } = useCollectRegisters();

  const {
    paymentsQuery: { data: payments, isFetching: loadingPayments },
  } = usePayments();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <HeaderCard
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
      <HeaderCard
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
      <HeaderCard
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
      <HeaderCard
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
