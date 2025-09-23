import type {
  VehicleMaintenances,
  VehicleStats,
} from '../../models/vehicles-stats-models';
import { ExportConfig, ExportToExcel } from '@/utilities';
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
        // @ts-expect-error no types for context yet
        label: (context) => {
          const value = context?.raw;
          const xAxisID = context?.dataset?.xAxisID;
          if (xAxisID === 'x') {
            return `Ingresos: $${Number(value).toLocaleString()}`;
          } else if (xAxisID === 'x2') {
            return `Días: ${Number(value).toLocaleString()}`;
          }
          return value;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
      },
      ticks: {
        font: {
          size: 14,
        },
      },
    },
    x2: {
      position: 'top',
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 15,
        },
        callback: (value) => {
          return `${Number(value).toLocaleString()} Días`;
        },
      },
    },
  },
};

interface Props {
  data?: VehicleStats;
  isLoading: boolean;
}

export const VehicleMaintenance = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.vehicleMaintenence.map((item) => item.name),
      datasets: [
        {
          label: 'Días acumulados en Taller / Siniestradas / Robadas',
          data: data.vehicleMaintenence.map((item) => item.dias_indisponibles),
          borderWidth: 2,
          borderRadius: 12,
          backgroundColor: ['rgba(83, 102, 255, 0.6)'],
          borderColor: ['rgba(83, 102, 255, 1)'],
          xAxisID: 'x2',
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Unidades indispuestas ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="150rem"
      downloadFn={() =>
        toExcel.exportData(data?.vehicleMaintenence || [])
      }
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<VehicleMaintenances> = {
  fileName: `Unidades indispuestas`,
  withDate: true,
  sheetName: 'Unidades',
  columns: [
    { accessorFn: (data) => data.name, header: 'Unidad' },
    { accessorFn: (data) => data.dias_indisponibles, header: 'Días transcurridos' },
    { accessorFn: (data) => data.orders_service, header: 'Ordenes de mantenimiento' },
    { accessorFn: (data) => data.reportes_ids, header: 'IDs Reportes' },
    { accessorFn: (data) => data.periodos_con_orden, header: 'Periodos' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

