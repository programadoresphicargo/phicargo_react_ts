import { ChartData, ChartOptions } from 'chart.js';
import { useEffect, useMemo, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import { WaybillStats } from '../../models/waybill-stats-model';
import dayjs from 'dayjs';

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

export const MonthlyRevenueChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  const year = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.monthlyRevenue.map((month) => month.month),
      datasets: [
        {
          label: 'Ingresos',
          data: data.monthlyRevenue.map((month) => month.amount),
          borderWidth: 2,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Año Pasado',
          data: data.pastYearMonthlyRevenues.map((month) => month.amount),
          borderWidth: 2,
          backgroundColor: ['rgba(40, 159, 64, 0.6)'],
          borderColor: ['rgba(40, 159, 64, 1)'],
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
      title={`Ingresos por mes de ${year}`}
      isLoading={isLoading || !chartData}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

