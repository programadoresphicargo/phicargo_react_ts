import { HeaderBase } from '@/components/ui';
import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { useMemo } from 'react';

const CountContenedor = ({ data }) => {

  const P = useMemo(
    () => data?.filter((complaint) => complaint.x_status_bel === 'P').length || 0,
    [data],
  );

  const SM = useMemo(
    () => data?.filter((complaint) => complaint.x_status_bel === 'sm').length || 0,
    [data],
  );

  const V = useMemo(
    () => data?.filter((complaint) => complaint.x_status_bel === 'V').length || 0,
    [data],
  );

  const pm = useMemo(
    () => data?.filter((complaint) => complaint.x_status_bel === 'pm').length || 0,
    [data],
  );

  return (
    <HeaderBase backRoute="/menu">
      <div className="mx-8">
        <h1 className="m-0 p-0 text-xl text-gray-100 font-bold">
          Pendientes de ingreso
        </h1>
      </div>

      <div className="flex gap-2 flex-1">
        <IndicatorCard title="Sin maniobra" content={SM} isLoading={false} />
        <IndicatorCard title="En patio" content={P} isLoading={false} />
        <IndicatorCard title="Viaje" content={V} isLoading={false} />
        <IndicatorCard title="Patio Mexico" content={pm} isLoading={false} />
      </div>
    </HeaderBase>
  );
};

export default CountContenedor;

