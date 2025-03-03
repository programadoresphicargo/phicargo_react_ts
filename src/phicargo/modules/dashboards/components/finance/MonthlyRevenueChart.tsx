import { ChartData, ChartOptions } from 'chart.js';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import {
  MonthlyRevenueByClient,
  WaybillStats,
} from '../../models/waybill-stats-model';
import { useEffect, useMemo, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import { WaybillStatsService } from '../../services/waybill-stats-service';
import dayjs from 'dayjs';
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

export const MonthlyRevenueChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const { branchId, companyId, monthString } = useDateRangeContext();

  const year = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.monthlyRevenue.map((month) => month.month),
      datasets: [
        {
          label: 'Ingresos',
          data: data.monthlyRevenue.map((month) => month.amount),
          borderWidth: 2,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Año Pasado',
          data: data.pastYearMonthlyRevenues.map((month) => month.amount),
          borderWidth: 2,
          backgroundColor: ['rgba(40, 159, 64, 0.6)'],
          borderColor: ['rgba(40, 159, 64, 1)'],
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
      title={`Ingresos por mes de ${year}`}
      isLoading={isLoading || !chartData}
      downloadFn={() =>
        exportMonthlyRevenue(
          monthString?.start || `${year}-01-01`,
          monthString?.end || `${year}-12-31`,
          companyId,
          branchId,
        )
      }
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportMonthlyRevenue = async (
  startDate: string,
  endDate: string,
  companyId: number | null,
  branchId: number | null,
) => {
  try {
    const exportConf: ExportConfig<MonthlyRevenueByClient> = {
      fileName: `Ingresos mensuales por cliente`,
      withDate: false,
      sheetName: 'Ingresos mensuales',
      columns: [
        { accessorFn: (data) => data.client, header: 'Cliente' },
        { accessorFn: (data) => data.total, header: 'Total' },
        { accessorFn: (data) => data.average, header: 'Promedio' },
        { accessorFn: (data) => data.january, header: 'Enero' },
        { accessorFn: (data) => data.february, header: 'Febrero' },
        { accessorFn: (data) => data.march, header: 'Marzo' },
        { accessorFn: (data) => data.april, header: 'Abril' },
        { accessorFn: (data) => data.may, header: 'Mayo' },
        { accessorFn: (data) => data.june, header: 'Junio' },
        { accessorFn: (data) => data.july, header: 'Julio' },
        { accessorFn: (data) => data.august, header: 'Agosto' },
        { accessorFn: (data) => data.september, header: 'Septiembre' },
        { accessorFn: (data) => data.october, header: 'Octubre' },
        { accessorFn: (data) => data.november, header: 'Noviembre' },
        { accessorFn: (data) => data.december, header: 'Diciembre' },
      ],
    };

    const toExcel = new ExportToExcel(exportConf);

    const data = await WaybillStatsService.getMonthlyRevenueByClient(
      startDate,
      endDate,
      companyId,
      branchId,
    );

    toExcel.exportData(data);
  } catch (error) {
    console.error(error);
  }
};

