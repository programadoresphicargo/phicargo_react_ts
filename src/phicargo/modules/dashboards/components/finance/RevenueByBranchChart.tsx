import type {
  BranchRevenue,
  WaybillStats,
} from '../../models/waybill-stats-model';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
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
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
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
      downloadFn={() => toExcel.exportData(data?.branchRevenue || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<BranchRevenue> = {
  fileName: `Ingresos por sucursal`,
  withDate: true,
  sheetName: 'Ingresos por sucursal',
  columns: [
    { accessorFn: (data) => data.branch, header: 'Sucursal' },
    { accessorFn: (data) => data.amount, header: 'Ingresos' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

