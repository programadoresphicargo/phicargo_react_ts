import { IndicatorCard } from './IndicatorCard';
import { useDateRangeContext } from '../hooks/useDateRangeContext';
import { useMemo } from 'react';
import { useTravelStatsQueries } from '../hooks/useTravelStatsQueries';

export const Indicators = () => {
  const { travelStatsQuery } = useTravelStatsQueries();
  const { monthYearName } = useDateRangeContext();

  const totalPods = useMemo(
    () =>
      travelStatsQuery.data?.byBranch.reduce(
        (acc, branch) => acc + branch.total,
        0,
      ) ?? 0,
    [travelStatsQuery.data],
  );

  return (
    <>
      <IndicatorCard
        title="Todas las POD's"
        value={totalPods}
        description={`Pruebas de entrega de ${monthYearName}`}
        color="blue"
        isLoading={travelStatsQuery.isFetching}
      />

      <IndicatorCard
        title="POD's Entregadas"
        value={travelStatsQuery.data?.byBranch.reduce(
          (acc, branch) => acc + branch.podsSent,
          0,
        )}
        description={`Pruebas de entrega entregadas ${monthYearName}`}
        color="green"
        isLoading={travelStatsQuery.isFetching}
      />

      <IndicatorCard
        title="POD's Pendientes"
        value={travelStatsQuery.data?.byBranch.reduce(
          (acc, branch) => acc + branch.podsPending,
          0,
        )}
        description={`Pruebas de entrega pendientes ${monthYearName}`}
        color="red"
        isLoading={travelStatsQuery.isFetching}
      />

      <IndicatorCard
        title="Meta Tentativa de Viajes"
        value={travelStatsQuery.data?.monthMeta}
        description={`Meta de ${monthYearName}`}
        color={(travelStatsQuery.data?.monthMeta || 0) > totalPods ? 'red' : 'green'}
        isLoading={travelStatsQuery.isFetching}
      />
    </>
  );
};

