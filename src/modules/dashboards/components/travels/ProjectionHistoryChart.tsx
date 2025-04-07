import { ChartData, ChartOptions } from 'chart.js';
import { ExportConfig, ExportToExcel } from '@/utilities';
import { useEffect, useMemo, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import { MonthlyTravelsByClient } from '../../models/travels-stats-models';
import TravelStatsServiceApi from '../../services/travel-stats-service';
import dayjs from 'dayjs';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';
import { useGetVehicleRevenueProjectionByBranchHistoryQuery } from '@/modules/vehicles/hooks/queries';

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 15,
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

export const ProjectionHistoryChart = () => {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const { branchId, companyId, monthString } = useDateRangeContext();

  const {
    getVehicleRevenueProjectionByBranchHistoryQuery: { data, isFetching },
  } = useGetVehicleRevenueProjectionByBranchHistoryQuery(
    monthString?.start || `${dayjs().format('YYYY')}-01-01`,
    monthString?.end || `${dayjs().format('YYYY')}-12-31`,
  );

  const year = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: 'VER',
          data: data
            .filter((item) => item.branch === 'VER')
            .map((item) => item.idealMonthlyRevenue),
          borderWidth: 2,
          backgroundColor: ['rgba(40, 159, 64, 0.6)'],
          borderColor: ['rgba(40, 159, 64, 1)'],
          borderDash: [5, 5],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'VER REAL',
          data: data
            .filter((item) => item.branch === 'VER')
            .map((item) => item.realMonthlyRevenue),
          borderWidth: 2,
          backgroundColor: ['rgba(40, 159, 64, 0.6)'],
          borderColor: ['rgba(40, 159, 64, 1)'],
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'MZN',
          data: data
            .filter((item) => item.branch === 'MZN')
            .map((item) => item.idealMonthlyRevenue),
          borderWidth: 2,
          backgroundColor: ['rgba(255, 206, 86, 0.6)'],
          borderColor: ['rgba(255, 206, 86, 1)'],
          borderDash: [5, 5],
          pointStyle: 'triangle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'MZN REAL',
          data: data
            .filter((item) => item.branch === 'MZN')
            .map((item) => item.realMonthlyRevenue),
          borderWidth: 2,
          backgroundColor: ['rgba(255, 206, 86, 0.6)'],
          borderColor: ['rgba(255, 206, 86, 1)'],
          pointStyle: 'triangle',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'MEX',
          data: data
            .filter((item) => item.branch === 'MEX')
            .map((item) => item.idealMonthlyRevenue),
          borderWidth: 2,
          backgroundColor: ['rgba(83, 102, 255, 0.6)'],
          borderColor: ['rgba(83, 102, 255, 1)'],
          borderDash: [5, 5],
          pointStyle: 'rectRounded',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'MEX REAL',
          data: data
            .filter((item) => item.branch === 'MEX')
            .map((item) => item.realMonthlyRevenue),
          borderWidth: 2,
          backgroundColor: ['rgba(83, 102, 255, 0.6)'],
          borderColor: ['rgba(83, 102, 255, 1)'],
          pointStyle: 'rectRounded',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Proyección VS Real en el año ${year}`}
      isLoading={isFetching || !chartData}
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

