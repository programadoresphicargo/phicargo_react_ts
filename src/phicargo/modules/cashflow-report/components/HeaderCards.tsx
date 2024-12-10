import { useCollectRegisters, usePayments } from '../hooks';

import Card from './Card';
import { formatCurrency } from '../utils/format-currency';
import { getProjection } from '../utils/get-projection';

const HeaderCards = () => {
  const {
    collectRegisterQuery: { data: registers, isFetching: loadingCollect },
  } = useCollectRegisters();

  const {
    paymentsQuery: { data: payments, isFetching: loadingPayments },
  } = usePayments();

  return (
    <>
      <Card
        title="Total Cobrado"
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
      <Card
        title="Proyección de Cobro"
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
      <Card
        title="Total Pagado"
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
      <Card
        title="Proyección de Pago"
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
    </>
  );
};

export default HeaderCards;
