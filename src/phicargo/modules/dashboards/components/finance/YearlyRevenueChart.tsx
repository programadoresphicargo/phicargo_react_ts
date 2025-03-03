import { ChartData, ChartOptions } from 'chart.js';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import { WaybillStats } from '../../models/waybill-stats-model';

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
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
        callback: (value) => {
          return `$${Number(value).toLocaleString()}`;
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
  data?: WaybillStats;
  isLoading: boolean;
}

export const YearlyRevenueChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.yearlyRevenue.map((month) => month.year),
      datasets: [
        {
          label: 'Ingresos',
          data: data.yearlyRevenue.map((month) => month.amount),
          borderWidth: 2,
          backgroundColor: ['rgba(153, 102, 255, 0.6)'],
          borderColor: ['rgba(153, 102, 255, 1)'],
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
      title={`Ingresos anuales`}
      isLoading={isLoading || !chartData}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

