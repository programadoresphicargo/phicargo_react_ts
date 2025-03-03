import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { VehicleStats } from '../../models/vehicles-stats-models';

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
};

interface Props {
  data?: VehicleStats;
  isLoading: boolean;
}

export const AvailableSummaryChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'pie'> = {
      labels: ['Disponibles', 'Sin Operador', 'En Mantenimiento'],
      datasets: [
        {
          data: Object.values(data.availableSummary),
          borderWidth: 2,
          backgroundColor: getBackgroundColors(data.distanceByVehicle.length),
          borderColor: getBorderColors(data.distanceByVehicle.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Unidades Disponibles`}
      isLoading={isLoading && !chartData}
    >
      {chartData && <Pie data={chartData} options={options} />}
    </ChartCard>
  );
};

