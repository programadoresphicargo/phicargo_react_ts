import type {
  DriverStats,
  ModalitySummary,
} from '../../models/driver-stats-models';
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
      downloadFn={() => exportData(data?.modalitySummary || [])}
    >
      {chartData && <Pie data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportData = (data: ModalitySummary[]) => {
  const exportConf: ExportConfig<ModalitySummary> = {
    fileName: `Operadores - Por Modalidad`,
    withDate: true,
    sheetName: 'Modalidad',
    columns: [
      { accessorFn: (data) => data.modality, header: 'Modalidad' },
      { accessorFn: (data) => data.driverCount, header: 'Conteo' },
    ],
  };

  const toExcel = new ExportToExcel(exportConf);
  toExcel.exportData(data);
};

