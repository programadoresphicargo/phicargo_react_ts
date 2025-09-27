import {
  DistanceAndRevenueByDriver,
  DriverStats,
} from '../../models/driver-stats-models';
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
  indexAxis: 'y',
  plugins: {
    tooltip: {
      callbacks: {
        // @ts-expect-error no types for context yet
        label: (context) => {
          const value = context?.raw;
          const xAxisID = context?.dataset?.xAxisID;
          if (xAxisID === 'x') {
            return `Ingresos: $${Number(value).toLocaleString()}`;
          } else if (xAxisID === 'x2') {
            return `Kilómetros: ${Number(value).toLocaleString()} km`;
          }
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
        callback: (value) => {
          return `$${Number(value).toLocaleString()}`;
        },
      },
    },
    x2: {
      position: 'top',
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 15,
        },
        callback: (value) => {
          return `${Number(value).toLocaleString()} km`;
        },
      },
    },
  },
};

interface Props {
  data?: DriverStats;
  isLoading: boolean;
}

export const DistanceAndRevenueByDriverChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.distanceAndRevenueByDriver.map((item) => item.driver),
      datasets: [
        {
          label: 'Ingresos',
          data: data.distanceAndRevenueByDriver.map((item) => item.amount),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 206, 86, 0.6)'],
          borderColor: ['rgba(255, 206, 86, 1)'],
          xAxisID: 'x',
        },
        {
          label: 'Kilómetros',
          data: data.distanceAndRevenueByDriver.map((item) => item.distance),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(210, 99, 132, 0.6)'],
          borderColor: ['rgba(210, 99, 132, 1)'],
          xAxisID: 'x2',
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Ingresos y Distancia Por Operador ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="150rem"
      downloadFn={() => exportData(data?.distanceAndRevenueByDriver || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: DistanceAndRevenueByDriver[]) => {
  const exportConf: ExportConfig<DistanceAndRevenueByDriver> = {
    fileName: `Ingresos y distancia por Operador`,
    withDate: true,
    sheetName: 'Operadores',
    columns: [
      { accessorFn: (data) => data.driver, header: 'Operador' },
      { accessorFn: (data) => data.amount, header: 'Ingresos' },
      {
        accessorFn: (data) => data.distance,
        header: 'Distancia',
      },
      { accessorFn: (data) => data.services, header: 'Servicios' },
      { accessorFn: (data) => data.travels, header: 'Viajes' },
      { accessorFn: (data) => data.travel_names, header: 'Viajes relacionados' },
      { accessorFn: (data) => data.waybill_names, header: 'Cartas porte relacionadas' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

