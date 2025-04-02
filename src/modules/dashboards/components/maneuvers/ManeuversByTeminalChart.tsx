import { ExportConfig, ExportToExcel } from '@/utilities';
import type { ManeuverStats, ManeuversTerminalCount } from '../../models/maneuvers-stats-model';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
      },
      ticks: {
        font: {
          size: 14,
        },
      },
    },
    x: {
      position: 'top',
      grid: {
        display: true,
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
  data?: ManeuverStats;
  isLoading: boolean;
}

export const ManeuversByTeminalChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();


  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.maneuversByTerminal.map((item) => item.terminal),
      datasets: [
        {
          label: 'Maniobras',
          data: data.maneuversByTerminal.map((item) => item.maneuversCount),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 206, 86, 0.6)'],
          borderColor: ['rgba(255, 206, 86, 1)'],
          xAxisID: 'x',
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Maniobras Por Terminal ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="70rem"
      downloadFn={() => exportData(data?.maneuversByTerminal || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: ManeuversTerminalCount[]) => {
  const exportConf: ExportConfig<ManeuversTerminalCount> = {
    fileName: `Maniobras por Terminal`,
    withDate: true,
    sheetName: 'Maniobras por Terminal',
    columns: [
      { accessorFn: (data) => data.terminal, header: 'Terminal' },
      { accessorFn: (data) => data.maneuversCount, header: 'Maniobras' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

