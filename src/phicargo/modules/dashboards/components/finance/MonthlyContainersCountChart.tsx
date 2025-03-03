import { ChartData, ChartOptions } from 'chart.js';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import type {
  MontlyContainersByClient,
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

export const MonthlyContainersCountChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const { branchId, companyId, monthString } = useDateRangeContext();

  const year = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.monthlyContainersCountSummary.map((month) => month.month),
      datasets: [
        {
          label: 'Año Actual',
          data: data.monthlyContainersCountSummary.map(
            (month) => month.containers,
          ),
          borderWidth: 2,
          backgroundColor: ['rgba(255, 159, 64, 0.6)'],
          borderColor: ['rgba(255, 159, 64, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Año Pasado',
          data: data.pastYearMonthlyContainersCountSummary.map(
            (month) => month.containers,
          ),
          borderWidth: 2,
          backgroundColor: ['rgba(54, 162, 235, 0.6)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
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
      title={`Contenedores por mes de ${year}`}
      isLoading={isLoading || !chartData}
      downloadFn={() =>
        exportMonthlyContainers(
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

const exportMonthlyContainers = async (
  startDate: string,
  endDate: string,
  companyId: number | null,
  branchId: number | null,
) => {
  try {
    const exportConf: ExportConfig<MontlyContainersByClient> = {
      fileName: `Contenedores mensuales por cliente`,
      withDate: false,
      sheetName: 'Contenedores mensuales',
      columns: [
        { accessorFn: (data) => data.client, header: 'Cliente' },
        { accessorFn: (data) => data.containers, header: 'Contenedores' },
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

    const data = await WaybillStatsService.getMonthlyContainersByClient(
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

