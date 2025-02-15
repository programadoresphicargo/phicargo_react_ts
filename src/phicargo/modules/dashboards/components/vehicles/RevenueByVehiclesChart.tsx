import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import type {
  RevenueByVehicle,
  VehicleStats,
} from '../../models/vehicles-stats-models';
import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
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
        label: (context) => {
          const value = context.raw;
          return `Ingresos: $${Number(value).toLocaleString()}`;
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
      position: 'top',
      grid: {
        display: false,
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
  },
};

interface Props {
  data?: VehicleStats;
  isLoading: boolean;
}

export const RevenueByVehicleChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.revenueByVehicle.map((item) => item.vehicle),
      datasets: [
        {
          label: 'Ingresos',
          data: data.revenueByVehicle.map((item) => item.amount),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(data.revenueByVehicle.length),
          borderColor: getBorderColors(data.revenueByVehicle.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Ingresos Por Unidad ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="65rem"
      downloadFn={() => toExcel.exportData(data?.revenueByVehicle || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<RevenueByVehicle> = {
  fileName: `Ingresos Por Unidad`,
  withDate: true,
  sheetName: 'Ingresos Por Unidad',
  columns: [
    { accessorFn: (data) => data.vehicle, header: 'Unidad' },
    { accessorFn: (data) => data.travels, header: 'Viajes' },
    {
      accessorFn: (data) => data.amount,
      header: 'Ingresos',
    },
  ],
};

const toExcel = new ExportToExcel(exportConf);

