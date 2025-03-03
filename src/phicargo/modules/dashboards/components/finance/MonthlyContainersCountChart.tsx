import { ChartData, ChartOptions } from 'chart.js';
import { useEffect, useMemo, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import { WaybillStats } from '../../models/waybill-stats-model';
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
  data?: WaybillStats;
  isLoading: boolean;
}

export const MonthlyContainersCountChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  const year = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.monthlyContainersCountSummary.map((month) => month.month),
      datasets: [
        {
          label: 'Año Actual',
          data: data.monthlyContainersCountSummary.map((month) => month.containers),
          borderWidth: 2,
          backgroundColor: ['rgba(255, 159, 64, 0.6)'],
          borderColor: ['rgba(255, 159, 64, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Año Pasado',
          data: data.pastYearMonthlyContainersCountSummary.map((month) => month.containers),
          borderWidth: 2,
          backgroundColor: ['rgba(54, 162, 235, 0.6)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
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
      title={`Contenedores por mes de ${year}`}
      isLoading={isLoading || !chartData}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

