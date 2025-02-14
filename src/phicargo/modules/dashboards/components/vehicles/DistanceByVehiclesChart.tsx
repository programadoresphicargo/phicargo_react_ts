import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import type { VehicleStats } from '../../models/vehicles-stats-models';
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
          return `${Number(value).toLocaleString()} KM`;
        },
      },
    },
  },
};

interface Props {
  data?: VehicleStats;
  isLoading: boolean;
}

export const DistanceByVehiclesChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.distanceByVehicle.map((item) => item.vehicle),
      datasets: [
        {
          label: 'Kilometros Recorridos',
          data: data.distanceByVehicle.map((item) => item.distance),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(data.distanceByVehicle.length),
          borderColor: getBorderColors(data.distanceByVehicle.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Distancia Recorrida Por Unidad ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="65rem"
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

