import { ChartData, ChartOptions } from 'chart.js';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import {
  MonthlyTravelsByClient,
  TravelStats,
} from '../../models/travels-stats-models';
import { useEffect, useMemo, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import TravelStatsServiceApi from '../../services/travel-stats-service';
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
  data?: TravelStats;
  isLoading: boolean;
}

export const MonthlyTravelsChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const { branchId, companyId, monthString } = useDateRangeContext();

  const year = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.monthlyTravelsCountSummary.map((month) => month.month),
      datasets: [
        {
          label: 'Año Actual',
          data: data.monthlyTravelsCountSummary.map((month) => month.travels),
          borderWidth: 2,
          backgroundColor: ['rgba(40, 159, 64, 0.6)'],
          borderColor: ['rgba(40, 159, 64, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Año Pasado',
          data: data.pastYearTravelsCountSummary.map((month) => month.travels),
          borderWidth: 2,
          backgroundColor: ['rgba(199, 199, 199, 0.6)'],
          borderColor: ['rgba(199, 199, 199, 1)'],
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
      title={`Viajes en el año ${year}`}
      isLoading={isLoading || !chartData}
      downloadFn={() =>
        exportMonthlyTravels(
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

const exportMonthlyTravels = async (
  startDate: string,
  endDate: string,
  companyId: number | null,
  branchId: number | null,
) => {
  try {
    const exportConf: ExportConfig<MonthlyTravelsByClient> = {
      fileName: `Viajes mensuales por cliente`,
      withDate: false,
      sheetName: ' mensuales',
      columns: [
        { accessorFn: (data) => data.client, header: 'Cliente' },
        { accessorFn: (data) => data.totalTravels, header: 'Viajes' },
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

    const data = await TravelStatsServiceApi.getMonthlyTravelsByClient(
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

