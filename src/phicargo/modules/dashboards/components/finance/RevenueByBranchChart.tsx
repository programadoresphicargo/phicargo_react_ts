import { getBackgroundColors, getBorderColors } from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import type { WaybillStats } from '../../models/waybill-stats-model';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'bar'> = {
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

export const RevenueByBranchChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.branchRevenue.map((branch) => branch.branch),
      datasets: [
        {
          label: '',
          data: data.branchRevenue.map((branch) => branch.amount),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(data.branchRevenue.length),
          borderColor: getBorderColors(data.branchRevenue.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Ingresos por Sucursal ${monthYearName}`}
      isLoading={isLoading && !chartData}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};
