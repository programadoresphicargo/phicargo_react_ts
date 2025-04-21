import { ExportConfig, ExportToExcel } from '@/utilities';
import type {
  ManeuverStats,
  ManeuversDriverJobCount,
} from '../../models/maneuvers-stats-model';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    tooltip: {
      callbacks: {
        // @ts-expect-error no types for context yet
        label: (context) => {
          const value = context?.raw;
          return value;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
      },
      ticks: {
        font: {
          size: 14,
        },
      },
    },
    x: {
      position: 'top',
      grid: {
        display: true,
      },
      ticks: {
        font: {
          size: 15,
        },
      },
    },
  },
};

interface Props {
  data?: ManeuverStats;
  isLoading: boolean;
  job: 'operator' | 'mover';
}

export const ManeuversByDriverChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  const stats =
    props.job === 'operator'
      ? data?.maneuversByOperator
      : data?.maneuversByMover;

  useEffect(() => {
    if (!stats) return;

    const chartData: ChartData<'bar'> = {
      labels: stats.map((item) => item.driver),
      datasets: [
        {
          label: 'Tarde',
          data: stats.map((item) => item.maneuversLate),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 159, 64, 0.6)'],
          borderColor: ['rgba(255, 159, 64, 1)'],
        },
        {
          label: 'A tiempo',
          data: stats.map((item) => item.maneuversOnTime),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(40, 159, 64, 0.6)'],
          borderColor: ['rgba(40, 159, 64, 1)'],
        },
        {
          label: 'Perdidas',
          data: stats.map((item) => item.maneuversLost),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 99, 132, 0.6)'],
          borderColor: ['rgba(255, 99, 132, 1)'],
        },
      ],
    };

    setChartData(chartData);
  }, [stats]);

  return (
    <ChartCard
      title={`Maniobras por ${
        props.job === 'operator' ? 'operador' : 'movedor'
      } ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="80rem"
      downloadFn={() => exportData(stats || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: ManeuversDriverJobCount[]) => {
  const exportConf: ExportConfig<ManeuversDriverJobCount> = {
    fileName: `Maniobras por Operador`,
    withDate: true,
    sheetName: 'Maniobras por Operador',
    columns: [
      { accessorFn: (data) => data.driver, header: 'Operador' },
      { accessorFn: (data) => data.totalManeuvers, header: 'Maniobras' },
      { accessorFn: (data) => data.maneuversLate, header: 'Tarde' },
      { accessorFn: (data) => data.maneuversOnTime, header: 'A tiempo' },
      { accessorFn: (data) => data.maneuversLost, header: 'Perdida' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

