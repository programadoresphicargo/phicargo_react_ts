import {
  ByConstructionType,
  TravelStats,
} from '../../models/travels-stats-models';
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
export const TravelsByConstruction = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.byConstructionType.map((item) => item.constructionType),
      datasets: [
        {
          label: 'Viajes Totales',
          data: data.byConstructionType.map((item) => item.totalTravels),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
        },
        {
          label: 'Viajes Completados',
          data: data.byConstructionType.map((item) => item.travelsCompleted),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
        },
        {
          label: 'Viajes Pendientes',
          data: data.byConstructionType.map((item) => item.travelsPending),
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
      title={`Viajes por tipo de armado ${monthYearName}`}
      isLoading={isLoading && !chartData}
      downloadFn={() => toExcel.exportData(data?.byConstructionType || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<ByConstructionType> = {
  fileName: `Viajes por tipo de armado`,
  withDate: true,
  sheetName: 'Viajes por tipo de armado',
  columns: [
    { accessorFn: (data) => data.constructionType, header: 'Armado' },
    { accessorFn: (data) => data.totalTravels, header: 'Viajes' },
    {
      accessorFn: (data) => data.travelsCompleted,
      header: 'Viajes Completados',
    },
    { accessorFn: (data) => data.travelsPending, header: 'Viajes Pendientes' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

