import { ExportConfig, ExportToExcel } from '@/utilities';
import type {
  ManeuverStateCount,
  ManeuverStats,
} from '../../models/maneuvers-stats-model';
import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
};

interface Props {
  data?: ManeuverStats;
  isLoading: boolean;
  today?: boolean;
}

export const ManeuversLateSummaryChart = (props: Props) => {
  const { isLoading, data, today } = props;
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'pie'> = {
      labels: data.maneuversLate.map((item) => item.state),
      datasets: [
        {
          data: data.maneuversLate.map((item) => item.maneuversCount),
          borderWidth: 2,
          backgroundColor: getBackgroundColors(data.maneuversLate.length),
          borderColor: getBorderColors(data.maneuversLate.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={today ? 'Maniobras Hoy' : 'Maniobras Tarde'}
      isLoading={isLoading && !chartData}
      downloadFn={() => exportData(data?.maneuversLate || [])}
    >
      {chartData && <Pie data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: ManeuverStateCount[]) => {
  const exportConf: ExportConfig<ManeuverStateCount> = {
    fileName: `Maniobras Tarde`,
    withDate: true,
    sheetName: 'Maniobras tarde',
    columns: [
      { accessorFn: (data) => data.state, header: 'Estado' },
      { accessorFn: (data) => data.maneuversCount, header: 'maniobras' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

