import type {
  DangerousLicenseSummary,
  DriverStats,
} from '../../models/driver-stats-models';
import { type ExportConfig, ExportToExcel } from '@/utilities';
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

export const DangerousLicenseSummaryChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'pie'> = {
      labels: data.dangerousLicenseSummary.map((item) => item.dangerousLicense),
      datasets: [
        {
          data: data.dangerousLicenseSummary.map((item) => item.driverCount),
          borderWidth: 2,
          backgroundColor: getBackgroundColors(8).reverse(),
          borderColor: getBorderColors(8).reverse(),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Por Licencia Peligrosa`}
      isLoading={isLoading && !chartData}
      downloadFn={() => exportData(data?.dangerousLicenseSummary || [])}
    >
      {chartData && <Pie data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: DangerousLicenseSummary[]) => {
  const exportConf: ExportConfig<DangerousLicenseSummary> = {
    fileName: `Operadores - Tipo de Licencia Peligrosa`,
    withDate: true,
    sheetName: 'Licencia Peligrosa',
    columns: [
      { accessorFn: (data) => data.dangerousLicense, header: 'Peligroso' },
      { accessorFn: (data) => data.driverCount, header: 'Conteo' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

