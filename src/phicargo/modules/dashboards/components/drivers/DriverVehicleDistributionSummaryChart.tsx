import {
  DriverStats,
  DriverVehicleDistributionSummary,
} from '../../models/driver-stats-models';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';

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
  data?: DriverStats;
  isLoading: boolean;
}

export const DriverVehicleDistributionSummaryChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.driverVehicleDistributionSummary.map((item) => item.job),
      datasets: [
        {
          label: 'Todas',
          data: data.driverVehicleDistributionSummary.map((item) => item.total),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
        },
        {
          label: 'Con Unidad',
          data: data.driverVehicleDistributionSummary.map(
            (item) => item.withVehicle,
          ),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
        },
        {
          label: 'Sin Unidad',
          data: data.driverVehicleDistributionSummary.map(
            (item) => item.withoutVehicle,
          ),
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
      title={`Distribución Unidades`}
      isLoading={isLoading && !chartData}
      downloadFn={() =>
        exportData(data?.driverVehicleDistributionSummary || [])
      }
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: DriverVehicleDistributionSummary[]) => {
  const exportConf: ExportConfig<DriverVehicleDistributionSummary> = {
    fileName: `Operadores - Distribución Unidades`,
    withDate: true,
    sheetName: 'Distribución Unidades',
    columns: [
      { accessorFn: (data) => data.job, header: 'Puesto' },
      { accessorFn: (data) => data.total, header: 'Total' },
      {
        accessorFn: (data) => data.withVehicle,
        header: 'Con Unidad',
      },
      { accessorFn: (data) => data.withoutVehicle, header: 'Sin Unidad' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

