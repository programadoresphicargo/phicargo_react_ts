import {
  ByTrafficExecutive,
  TravelStats,
} from '../../models/travels-stats-models';
import { CategoryScale, ChartOptions } from 'chart.js';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

Chart.register(CategoryScale);

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    tooltip: {
      callbacks: {
        title: (context) => {
          return context[0].label.replace(/,/g, ' ');
        },
      },
    },
  },
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
          size: 9,
        },
        maxRotation: 0,
        minRotation: 0,
      },
    },
  },
};

interface Props {
  data?: TravelStats;
  isLoading: boolean;
}

export const TravelsByTrafficExecutive = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      // labels: data.byTrafficExecutive.map((item) =>
      //   item.trafficExecutive.split(' '),
      // ),
      labels: data.byTrafficExecutive.map((item) => item.trafficExecutive),
      datasets: [
        {
          label: 'Viajes',
          data: data.byTrafficExecutive.map((item) => item.totalTravels),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 159, 64, 1)'],
        },
        {
          label: 'Viajes Completados',
          data: data.byTrafficExecutive.map((item) => item.travelsCompleted),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
        },
        {
          label: 'Viajes',
          data: data.byTrafficExecutive.map((item) => item.travelsPending),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgba(153, 102, 255, 1)'],
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Viajes por Ejecutivo ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="49rem"
      downloadFn={() => toExcel.exportData(data?.byTrafficExecutive || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<ByTrafficExecutive> = {
  fileName: `Viajes por Ejecutivo`,
  withDate: true,
  sheetName: 'Viajes por Ejecutivo',
  columns: [
    { accessorFn: (data) => data.trafficExecutive, header: 'Ejecutivo' },
    { accessorFn: (data) => data.totalTravels, header: 'Viajes Totales' },
    {
      accessorFn: (data) => data.travelsCompleted,
      header: 'Viajes completados',
    },
    { accessorFn: (data) => data.travelsPending, header: 'Viajes pendientes' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

