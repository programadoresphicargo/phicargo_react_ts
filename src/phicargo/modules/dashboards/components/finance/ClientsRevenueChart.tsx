import type {
  ClientRevenue,
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
  indexAxis: 'y',
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
          size: 13,
        },
      },
    },
    x: {
      position: 'top',
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
  },
};

interface Props {
  data?: WaybillStats;
  isLoading: boolean;
}

export const ClientsRevenueChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  // const actions: ChartActions[] = [
  //   {
  //     action: 'Resumen Mensual',
  //     handler: () =>
  //       exportMonthlySummary(
  //         data?.monthlyRevenuesByClient || [],
  //         month?.[0].getFullYear() || new Date().getFullYear(),
  //       ),
  //   },
  // ];

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.clientRevenue.map((item) => item.client),
      datasets: [
        {
          label: 'Ingresos',
          data: data.clientRevenue.map((item) => item.amount),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(data.clientRevenue.length),
          borderColor: getBorderColors(data.clientRevenue.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Ingresos Por Cliente ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="100rem"
      downloadFn={() => toExcel.exportData(data?.clientRevenue || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<ClientRevenue> = {
  fileName: `Ingresos por cliente`,
  withDate: false,
  sheetName: 'Ingresos por cliente',
  columns: [
    { accessorFn: (data) => data.client, header: 'Cliente' },
    { accessorFn: (data) => data.amount, header: 'Ingresos' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

