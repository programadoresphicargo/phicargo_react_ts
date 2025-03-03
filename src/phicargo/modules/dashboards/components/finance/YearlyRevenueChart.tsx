import { ChartData, ChartOptions } from 'chart.js';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import {
  WaybillStats,
  YearlyRevenueByClient,
} from '../../models/waybill-stats-model';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import { WaybillStatsService } from '../../services/waybill-stats-service';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'line'> = {
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

export const YearlyRevenueChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const { branchId, companyId } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.yearlyRevenue.map((month) => month.year),
      datasets: [
        {
          label: 'Ingresos',
          data: data.yearlyRevenue.map((month) => month.amount),
          borderWidth: 2,
          backgroundColor: ['rgba(153, 102, 255, 0.6)'],
          borderColor: ['rgba(153, 102, 255, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard 
      title={`Ingresos anuales`} 
      isLoading={isLoading || !chartData}
      downloadFn={() => exportYearlyRevenues(companyId, branchId)}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportYearlyRevenues = async (
  companyId: number | null,
  branchId: number | null,
) => {
  try {
    const exportConf: ExportConfig<YearlyRevenueByClient> = {
      fileName: `Ingresos por cliente`,
      withDate: false,
      sheetName: 'Ingresos por cliente',
      columns: [
        { accessorFn: (data) => data.client, header: 'Cliente' },
        { accessorFn: (data) => data.total, header: 'Total' },
        { accessorFn: (data) => data.average, header: 'Promedio' },
        { accessorFn: (data) => data[2022], header: '2022' },
        { accessorFn: (data) => data[2023], header: '2023' },
        { accessorFn: (data) => data[2024], header: '2024' },
        { accessorFn: (data) => data[2025], header: '2025' },
        { accessorFn: (data) => data[2026], header: '2026' },
        { accessorFn: (data) => data[2027], header: '2027' },
        { accessorFn: (data) => data[2028], header: '2028' },
        { accessorFn: (data) => data[2029], header: '2029' },
        { accessorFn: (data) => data[2030], header: '2030' },
      ],
    };

    const toExcel = new ExportToExcel(exportConf);

    const data = await WaybillStatsService.getYearlyRevenueByClient(
      companyId,
      branchId,
    );

    toExcel.exportData(data);
  } catch (error) {
    console.error(error);
  }
};

