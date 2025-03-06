import { ChartData, ChartOptions } from 'chart.js';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import { TravelStats } from '../../models/travels-stats-models';

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

export const YearlyTravelsChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.yearTravelsCountSummary.map((month) => month.year),
      datasets: [
        {
          label: 'Viajes',
          data: data.yearTravelsCountSummary.map((month) => month.travels),
          borderWidth: 2,
          backgroundColor: ['rgba(83, 102, 255, 0.6)'],
          borderColor: ['rgba(83, 102, 255, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Viajes por año`}
      isLoading={isLoading || !chartData}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

