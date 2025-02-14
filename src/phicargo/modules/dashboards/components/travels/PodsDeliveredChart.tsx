import { ByBranch, TravelStats } from '../../models/travels-stats-models';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 15,
        },
      },
    },
    x: {
      grid: {
        display: false,
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
  data?: TravelStats;
  isLoading: boolean;
}

export const PodsDeliveredChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.byBranch.map((branch) => branch.code),
      datasets: [
        {
          label: 'Todas',
          data: data.byBranch.map((branch) => branch.total),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
        },
        {
          label: 'Enviadas',
          data: data.byBranch.map((branch) => branch.podsSent),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
        },
        {
          label: 'Pendientes',
          data: data.byBranch.map((branch) => branch.podsPending),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255,99,132, 1)'],
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Pruebas de Entrega ${monthYearName}`}
      isLoading={isLoading && !chartData}
      downloadFn={() => toExcel.exportData(data?.byBranch || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<ByBranch> = {
  fileName: `Pruebas de Entrega`,
  withDate: true,
  sheetName: 'Pruebas de entrega',
  columns: [
    { accessorFn: (data) => data.branch, header: 'Sucursal' },
    { accessorFn: (data) => data.code, header: 'Codigo' },
    { accessorFn: (data) => data.total, header: 'PODs' },
    { accessorFn: (data) => data.podsPending, header: 'PODs Pendientes' },
    { accessorFn: (data) => data.podsSent, header: 'PODs Enviadas' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

