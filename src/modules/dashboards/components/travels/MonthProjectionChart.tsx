import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';
import { useGetVehicleRevenueProjectionByBranchHistoryQuery } from '@/modules/vehicles/hooks/queries';

const options: ChartOptions<'bar'> = {
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

export const MonthProjectionChart = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName, monthString } = useDateRangeContext();

  const {
    getVehicleRevenueProjectionByBranchHistoryQuery: { data, isFetching },
  } = useGetVehicleRevenueProjectionByBranchHistoryQuery(
    monthString?.start || `${dayjs().format('YYYY')}-01-01`,
    monthString?.end || `${dayjs().format('YYYY')}-12-31`,
  );

  useEffect(() => {
    if (!data) return;

    // Obtener las sucursales únicas
    const branches = [...new Set(data.map((item) => item.branch))];

    const chartData: ChartData<'bar'> = {
      labels: branches, // Las sucursales serán las etiquetas del eje X
      datasets: [
        {
          label: 'Proyección',
          data: branches.map((branch) => {
            const lastRecord = data
              .filter((item) => item.branch === branch)
              .slice(-1)[0];
            return lastRecord ? lastRecord.idealMonthlyRevenue : 0;
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          borderRadius: 10,
        },
        {
          label: 'Real',
          data: branches.map((branch) => {
            const lastRecord = data
              .filter((item) => item.branch === branch)
              .slice(-1)[0];
            return lastRecord ? lastRecord.total : 0;
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          borderRadius: 10,
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Proyección ${monthYearName}`}
      isLoading={isFetching && !chartData}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

// const exportConf: ExportConfig<ByBranch> = {
//   fileName: `Pruebas de Entrega`,
//   withDate: true,
//   sheetName: 'Pruebas de entrega',
//   columns: [
//     { accessorFn: (data) => data.branch, header: 'Sucursal' },
//     { accessorFn: (data) => data.code, header: 'Codigo' },
//     { accessorFn: (data) => data.total, header: 'PODs' },
//     { accessorFn: (data) => data.podsPending, header: 'PODs Pendientes' },
//     { accessorFn: (data) => data.podsSent, header: 'PODs Enviadas' },
//   ],
// };

// const toExcel = new ExportToExcel(exportConf);

