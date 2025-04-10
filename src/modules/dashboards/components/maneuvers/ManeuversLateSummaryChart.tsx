import { ExportConfig, ExportToExcel } from '@/utilities';
import type { ManeuverStateCount, ManeuverStats } from '../../models/maneuvers-stats-model';
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

  const meneuvers = today ? data?.todayManeuversLate : data?.maneuversLate;

  useEffect(() => {
    if (!meneuvers) return;

    const chartData: ChartData<'pie'> = {
      labels: meneuvers.map((item) => item.state),
      datasets: [
        {
          data: meneuvers.map((item) => item.maneuversCount),
          borderWidth: 2,
          backgroundColor: getBackgroundColors(meneuvers.length),
          borderColor: getBorderColors(meneuvers.length),
        },
      ],
    };

    setChartData(chartData);
  }, [meneuvers]);

  return (
    <ChartCard
      title={today ? 'Maniobras Hoy' : 'Maniobras Tarde'}
      isLoading={isLoading && !chartData}
      downloadFn={() => exportData(meneuvers || [])}
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

