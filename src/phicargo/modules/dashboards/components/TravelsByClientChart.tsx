import { CategoryScale, ChartOptions } from 'chart.js';
import { useEffect, useMemo, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { ChartCard } from './ChartCard';
import { ChartData } from 'chart.js';
import { TravelStats } from '../models/travels-stats-models';
import dayjs from 'dayjs';
import { useDateRangeContext } from '../hooks/useDateRangeContext';

Chart.register(CategoryScale);

const options: ChartOptions<'bar'> = {
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

export const TravelsByClientChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { month } = useDateRangeContext();

  const monthName = useMemo(() => {
    if (!month) return '';
    const date = month[0];
    return dayjs(date).format('MMMM YYYY');
  }, [month]);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.byClient.map((r) => r.client),
      datasets: [
        { 
          label: 'Viajes',
          data: data.byClient.map((r) => r.travels),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)'
          ],
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Viajes por cliente ${monthName}`}
      isLoading={isLoading && !chartData}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

