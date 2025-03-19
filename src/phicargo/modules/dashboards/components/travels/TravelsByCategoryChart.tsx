import { ByCategory, TravelStats } from '../../models/travels-stats-models';
import { ExportConfig, ExportToExcel } from '@/utilities';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getBackgroundColors } from '../../utils/charts-colors';
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
  const [chartData, setChartData] = useState<ChartData<'doughnut'> | null>(
    null,
  );
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'doughnut'> = {
      labels: data.byCategory.map((item) => item.category),
      datasets: [
        {
          label: 'Viajes Totales',
          data: data.byCategory.map((item) => item.travels),
          backgroundColor: getBackgroundColors(data.byCategory.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Viajes por categoria ${monthYearName}`}
      isLoading={isLoading && !chartData}
      downloadFn={() => toExcel.exportData(data?.byCategory || [])}
    >
      {chartData && <Doughnut data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<ByCategory> = {
  fileName: `Viajes por categoria`,
  withDate: true,
  sheetName: 'Viajes por categoria',
  columns: [
    { accessorFn: (data) => data.category, header: 'Tipo de carga' },
    { accessorFn: (data) => data.travels, header: 'Viajes' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

