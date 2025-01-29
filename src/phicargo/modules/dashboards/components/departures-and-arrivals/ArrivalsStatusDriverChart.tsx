import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartActions } from '../../types';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import type { DepartureAndArrivalStats } from '../../models/departure-and-arrival-models';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
        },
      },
    },
    x: {
      position: 'bottom',
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

const actions: ChartActions[] = [
  {
    action: 'Llegadas Tarde',
    handler: () => console.log('Llegadas Tarde'),
  },
  {
    action: 'Llegadas Temprano',
    handler: () => console.log('Llegadas Temprano'),
  },
]
 
interface Props {
  data?: DepartureAndArrivalStats;
  isLoading: boolean;
}

export const ArrivalsStatusDriverChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.arrivalStatusDrivers.map((item) => item.driver),
      datasets: [
        {
          label: 'Estatus de Llegada',
          data: data.arrivalStatusDrivers.map((item) => item.arrivalLate),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(data.arrivalStatusDrivers.length),
          borderColor: getBorderColors(data.arrivalStatusDrivers.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Llegadas ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight='70rem'
      actions={actions}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
}
