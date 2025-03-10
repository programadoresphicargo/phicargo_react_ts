import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import type { DepartureAndArrivalStats } from '../../models/departure-and-arrival-models';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 15,
        },
      },
    },
    x: {
      position: 'bottom',
      ticks: {
        font: {
          size: 15,
        },
      },
    },
  },
};

interface Props {
  data?: DepartureAndArrivalStats;
  isLoading: boolean;
}

export const DepartureStatusChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.departures.map((item) => item.departureStatus),
      datasets: [
        { 
          label: '',
          data: data.departures.map((item) => item.travels),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(data.departures.length),
          borderColor: getBorderColors(data.departures.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Salidas ${monthYearName}`}
      isLoading={isLoading && !chartData}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

