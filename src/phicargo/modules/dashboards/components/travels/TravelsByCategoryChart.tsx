import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TravelStats } from '../../models/travels-stats-models';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
};

interface Props {
  data?: TravelStats;
  isLoading: boolean;
}


export const TravelsByCategoryChart = (props: Props) => {
const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'doughnut'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'doughnut'> = {
      labels: data.byCategory.map((item) => item.category),
      datasets: [
        {
          label: 'Viajes Totales',
          data: data.byCategory.map((item) => item.travels),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Viajes por tipo de carga ${monthYearName}`}
      isLoading={isLoading && !chartData}
    >
      {chartData && <Doughnut data={chartData} options={options} />}
    </ChartCard>
  );
}
