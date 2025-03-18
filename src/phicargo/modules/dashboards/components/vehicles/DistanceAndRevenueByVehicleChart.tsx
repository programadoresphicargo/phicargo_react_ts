import type {
  DistanceAndRevenueByVehicle,
  VehicleStats,
} from '../../models/vehicles-stats-models';
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
  data?: VehicleStats;
  isLoading: boolean;
}

export const DistanceAndRevenueByVehicleChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.distanceAndRevenueByVehicle.map((item) => item.vehicle),
      datasets: [
        {
          label: 'Ingresos',
          data: data.distanceAndRevenueByVehicle.map((item) => item.amount),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(40, 159, 64, 0.6)'],
          borderColor: ['rgba(40, 159, 64, 1)'],
          xAxisID: 'x',
        },
        {
          label: 'Kilómetros',
          data: data.distanceAndRevenueByVehicle.map((item) => item.distance),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(83, 102, 255, 0.6)'],
          borderColor: ['rgba(83, 102, 255, 1)'],
          xAxisID: 'x2',
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Ingresos y Distancia Por Unidad ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="150rem"
      downloadFn={() =>
        toExcel.exportData(data?.distanceAndRevenueByVehicle || [])
      }
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<DistanceAndRevenueByVehicle> = {
  fileName: `Ingresos y distancia por Unidad`,
  withDate: true,
  sheetName: 'Unidades',
  columns: [
    { accessorFn: (data) => data.vehicle, header: 'Unidad' },
    { accessorFn: (data) => data.amount, header: 'Ingresos' },
    {
      accessorFn: (data) => data.distance,
      header: 'Distancia',
    },
    { accessorFn: (data) => data.travels, header: 'Viajes' },
    { accessorFn: (data) => data.services, header: 'Servicios' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

