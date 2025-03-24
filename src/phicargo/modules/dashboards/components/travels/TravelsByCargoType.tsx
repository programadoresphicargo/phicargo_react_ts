import type {
  ByCargoType,
  TravelStats,
} from '../../models/travels-stats-models';
import { ExportConfig, ExportToExcel } from '@/utilities';
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
      ticks: {
        font: {
          size: 15,
        },
      },
    },
    x: {
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

export const TravelsByCargoType = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.byCargoType.map((item) => item.cargoType),
      datasets: [
        {
          label: 'Viajes Totales',
          data: data.byCargoType.map((item) => item.totalTravels),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgba(153, 102, 255, 1)'],
        },
        {
          label: 'Viajes Completados',
          data: data.byCargoType.map((item) => item.travelsCompleted),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
        },
        {
          label: 'Viajes Pendientes',
          data: data.byCargoType.map((item) => item.travelsPending),
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
      title={`Viajes por tipo de carga ${monthYearName}`}
      isLoading={isLoading && !chartData}
      downloadFn={() => toExcel.exportData(data?.byCargoType || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<ByCargoType> = {
  fileName: `Viajes por tipo de carga`,
  withDate: true,
  sheetName: 'Viajes por tipo de carga',
  columns: [
    { accessorFn: (data) => data.cargoType, header: 'Tipo de Carga' },
    { accessorFn: (data) => data.totalTravels, header: 'Viajes Totales' },
    {
      accessorFn: (data) => data.travelsCompleted,
      header: 'Viajes completados',
    },
    { accessorFn: (data) => data.travelsPending, header: 'Viajes pendientes' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

