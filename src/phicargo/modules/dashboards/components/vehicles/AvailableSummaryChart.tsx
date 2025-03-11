import { ExportConfig, ExportToExcel } from '@/phicargo/modules/core/utilities/export-to-excel';
import { useEffect, useState } from 'react';

import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import VehicleServiceApi from '@/phicargo/modules/availability/services/vehicle-service';
import type { VehicleStats } from '../../models/vehicles-stats-models';

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
};

const colors = [
  'rgba(75, 192, 192, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(255, 99, 132, 0.6)',
  'rgba(255, 99, 132, 0.6)',
];
const borderColors = [
  'rgba(75, 192, 192, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 99, 132, 1)',
  'rgba(255, 99, 132, 1)',
];

interface Props {
  data?: VehicleStats;
  isLoading: boolean;
}

export const AvailableSummaryChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null);

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'pie'> = {
      labels: [
        'Disponibles',
        'Sin Operador (Carretera)',
        'Sin Operador (Locales)',
        'En Mantenimiento (Carretera)',
        'En Mantenimiento (Locales)',
      ],
      datasets: [
        {
          data: Object.values(data.availableSummary),
          borderWidth: 2,
          backgroundColor: colors,
          borderColor: borderColors,
        },
      ],
    };

    setChartData(chartData);
  }, [data]);

  return (
    <ChartCard
      title={`Unidades Disponibles`}
      isLoading={isLoading && !chartData}
      downloadFn={exportAvailabilityData}
    >
      {chartData && <Pie data={chartData} options={options} />}
    </ChartCard>
  );
};


type AvailabilityData = {
  vehicle: string;
  status: 'Disponible' | 'Sin Operador' | 'Mantenimiento';
  type: string;
}

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
        type: vehicle.vehicleType!
      }
    });

    toExcel.exportData(data);
  } catch (error) {
    console.error(error);
  }
};

