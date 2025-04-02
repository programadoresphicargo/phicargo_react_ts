import type { DriverStats, JobSummary } from '../../models/driver-stats-models';
import { ExportConfig, ExportToExcel } from '@/utilities';
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
  data?: DriverStats;
  isLoading: boolean;
}

export const JobSummaryChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'pie'> = {
      labels: data.jobSummary.map((item) => item.job),
      datasets: [
        {
          data: data.jobSummary.map((item) => item.driverCount),
          borderWidth: 2,
          backgroundColor: getBackgroundColors(6).reverse(),
          borderColor: getBorderColors(6).reverse(),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Por Puesto`}
      isLoading={isLoading && !chartData}
      downloadFn={() => exportData(data?.jobSummary || [])}
    >
      {chartData && <Pie data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: JobSummary[]) => {
  const exportConf: ExportConfig<JobSummary> = {
    fileName: `Operadores - Puestos`,
    withDate: true,
    sheetName: 'Puestos',
    columns: [
      { accessorFn: (data) => data.job, header: 'Puesto' },
      { accessorFn: (data) => data.driverCount, header: 'Conteo' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

