import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import type { DriverStats } from '../../models/driver-stats-models';
import { Pie } from 'react-chartjs-2';

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
};

interface Props {
  data?: DriverStats;
  isLoading: boolean;
}

export const ModalitySummaryChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'pie'> = {
      labels: data.modalitySummary.map((item) => item.modality),
      datasets: [
        {
          data: data.modalitySummary.map((item) => item.driverCount),
          borderWidth: 2,
          backgroundColor: getBackgroundColors(data.modalitySummary.length),
          borderColor: getBorderColors(data.modalitySummary.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Por modalidad`}
      isLoading={isLoading && !chartData}
    >
      {chartData && <Pie data={chartData} options={options} />}
    </ChartCard>
  );
};
