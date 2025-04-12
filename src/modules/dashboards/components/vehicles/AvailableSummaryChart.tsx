import { ExportConfig, ExportToExcel } from '@/utilities';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { VehicleServiceApi } from '@/modules/vehicles/services';
import type { VehicleStats } from '../../models/vehicles-stats-models';

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      stacked: true,
      ticks: {
        font: {
          size: 15,
        },
      },
    },
    x: {
      stacked: true,
      ticks: {
        font: {
          size: 15,
        },
      },
    },
  },
};

interface Props {
  data?: VehicleStats;
  isLoading: boolean;
}

export const AvailableSummaryChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.availableSummary.map((item) => item.vehicleType),
      datasets: [
        {
          label: 'Todas',
          data: data.availableSummary.map((item) => item.total),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          stack: 'Stack 0',
        },
        {
          label: 'Disponibles',
          data: data.availableSummary.map((item) => item.available),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          stack: 'Stack 1',
        },
        {
          label: 'Sin Operador',
          data: data.availableSummary.map((item) => item.noDriverNoPostura),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255,99,132, 1)'],
          stack: 'Stack 2',
        },
        {
          label: 'Sin Operador (Postura)',
          data: data.availableSummary.map((item) => item.noDriverPostura),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          stack: 'Stack 2',
        },
        {
          label: 'Mantenimiento (Sin Operador)',
          data: data.availableSummary.map((item) => item.maintenanceNoDriver),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(255, 159, 64, 0.6)'],
          borderColor: ['rgba(255, 159, 64, 1)'],
          stack: 'Stack 3',
        },
        {
          label: 'Mantenimiento (Con Operador)',
          data: data.availableSummary.map((item) => item.maintenanceDriver),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          stack: 'Stack 3',
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Disponibilidad`}
      isLoading={isLoading && !chartData}
      downloadFn={exportAvailabilityData}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

type AvailabilityData = {
  vehicle: string;
  status: 'Disponible' | 'Sin Operador' | 'Mantenimiento';
  type: string;
  driver: string | null;
  driverPostura: string | null;
};

const exportAvailabilityData = async () => {
  try {
    const exportConf: ExportConfig<AvailabilityData> = {
      fileName: `Disponibilidad de Unidades`,
      withDate: false,
      sheetName: 'Disponibilidad de Unidades',
      columns: [
        { accessorFn: (data) => data.vehicle, header: 'Unidad' },
        { accessorFn: (data) => data.status, header: 'Estado' },
        { accessorFn: (data) => data.type, header: 'Tipo' },
        { accessorFn: (data) => data.driver, header: 'Operador' },
        { accessorFn: (data) => data.driverPostura, header: 'Postura Activa' },
      ],
    };

    const toExcel = new ExportToExcel(exportConf);

    const vehicles = await VehicleServiceApi.getVehicles();

    const data = vehicles.map<AvailabilityData>((vehicle) => {
      let status = '';
      if (vehicle.state?.id === 1 && vehicle.driver) {
        status = 'Disponible';
      } else if (vehicle.state?.id === 1 && !vehicle.driver) {
        status = 'Sin Operador';
      } else if (vehicle.state?.id === 5) {
        status = 'Mantenimiento';
      }
      return {
        vehicle: vehicle.name,
        status: status as 'Disponible' | 'Sin Operador' | 'Mantenimiento',
        type: vehicle.vehicleType!,
        driver: vehicle.driver?.name || null,
        driverPostura: vehicle.driverPostura?.name || null, 
      };
    });

    toExcel.exportData(data);
  } catch (error) {
    console.error(error);
  }
};

