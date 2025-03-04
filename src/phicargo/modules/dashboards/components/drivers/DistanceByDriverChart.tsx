import {
  DistanceByDriver,
  DriverStats,
} from '../../models/driver-stats-models';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
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
          return `Distancia: ${Number(value).toLocaleString()} KM`;
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
          size: 13,
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
          return `${Number(value).toLocaleString()} KM`;
        },
      },
    },
  },
};

interface Props {
  data?: DriverStats;
  isLoading: boolean;
}

export const DistanceByDriverChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.distanceByDriver.map((item) => item.driver),
      datasets: [
        {
          label: 'Kilometros Recorridso',
          data: data.distanceByDriver.map((item) => item.distance),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(data.revenueByDriver.length),
          borderColor: getBorderColors(data.revenueByDriver.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Distancia Recorrida Por Operador ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="100rem"
      downloadFn={() => toExcel.exportData(data?.distanceByDriver || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<DistanceByDriver> = {
  fileName: `Distancia Recorrida Por Operador`,
  withDate: true,
  sheetName: 'Distancia Por Operador',
  columns: [
    { accessorFn: (data) => data.driver, header: 'Operador' },
    { accessorFn: (data) => data.travels, header: 'Viajes' },
    {
      accessorFn: (data) => data.distance,
      header: 'Distancia Recorrida (KM)',
    },
  ],
};

const toExcel = new ExportToExcel(exportConf);

