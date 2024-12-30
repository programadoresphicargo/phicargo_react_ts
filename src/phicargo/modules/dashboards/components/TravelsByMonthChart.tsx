import { ChartData, ChartOptions } from 'chart.js';
import { useEffect, useMemo, useState } from 'react';

import { ChartCard } from './ChartCard';
import { Line } from 'react-chartjs-2';
import type { TravelStats } from '../models/travels-stats-models';
import dayjs from 'dayjs';

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
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

export const TravelsByMonthChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  const year = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.ofYear.map((month) => month.month),
      datasets: [
        {
          label: 'Pods entregados',
          data: data.ofYear.map((month) => month.podsSent),
          borderWidth: 2,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Viajes en el año ${year}`}
      isLoading={isLoading || !chartData}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

