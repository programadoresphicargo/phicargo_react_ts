import { ChartData, ChartOptions } from 'chart.js';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import {
  TravelStats,
  YearlyTravelsByClient,
} from '../../models/travels-stats-models';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { Line } from 'react-chartjs-2';
import TravelStatsServiceApi from '../../services/travel-stats-service';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

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

interface Props {
  data?: TravelStats;
  isLoading: boolean;
}

export const YearlyTravelsChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const { branchId, companyId } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'line'> = {
      labels: data.yearTravelsCountSummary.map((month) => month.year),
      datasets: [
        {
          label: 'Viajes',
          data: data.yearTravelsCountSummary.map((month) => month.travels),
          borderWidth: 2,
          backgroundColor: ['rgba(83, 102, 255, 0.6)'],
          borderColor: ['rgba(83, 102, 255, 1)'],
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
      title={`Viajes por año`}
      isLoading={isLoading || !chartData}
      downloadFn={() => exportYearlyTravels(companyId, branchId)}
    >
      {chartData && <Line data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportYearlyTravels = async (
  companyId: number | null,
  branchId: number | null,
) => {
  try {
    const exportConf: ExportConfig<YearlyTravelsByClient> = {
      fileName: `Viajes anuales por cliente`,
      withDate: false,
      sheetName: 'Viajes anuales',
      columns: [
        { accessorFn: (data) => data.client, header: 'Cliente' },
        { accessorFn: (data) => data.totalTravels, header: 'Viajes' },
        { accessorFn: (data) => data.average, header: 'Promedio' },
        { accessorFn: (data) => data[2019], header: '2019' },
        { accessorFn: (data) => data[2020], header: '2020' },
        { accessorFn: (data) => data[2021], header: '2021' },
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

    const data = await TravelStatsServiceApi.getYearlyTravelsByClient(
      companyId,
      branchId,
    );

    toExcel.exportData(data);
  } catch (error) {
    console.error(error);
  }
};
