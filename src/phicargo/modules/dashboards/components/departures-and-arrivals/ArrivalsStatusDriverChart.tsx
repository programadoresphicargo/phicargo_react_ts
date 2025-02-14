import type {
  ArrivalStatusDriver,
  DepartureAndArrivalStats,
} from '../../models/departure-and-arrival-models';
import {
  ExportConfig,
  ExportToExcel,
} from '@/phicargo/modules/core/utilities/export-to-excel';
import {
  getBackgroundColors,
  getBorderColors,
} from '../../utils/charts-colors';
import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { ChartActions } from '../../types';
import { ChartCard } from '../ChartCard';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { useDateRangeContext } from '../../hooks/useDateRangeContext';

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
        },
      },
    },
    x: {
      position: 'bottom',
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
  data?: DepartureAndArrivalStats;
  isLoading: boolean;
}

export const ArrivalsStatusDriverChart = (props: Props) => {
  const { isLoading, data } = props;
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const { monthYearName } = useDateRangeContext();

  const [selectedAction, setSelectedAction] = useState<
    'arrivalLate' | 'arrivalEarly'
  >('arrivalLate');

  const actions: ChartActions[] = [
    {
      action: 'Llegadas Tarde',
      handler: () => setSelectedAction('arrivalLate'),
    },
    {
      action: 'Llegadas Temprano',
      handler: () => setSelectedAction('arrivalEarly'),
    },
  ];

  useEffect(() => {
    if (!data) return;

    const chartData: ChartData<'bar'> = {
      labels: data.arrivalStatusDrivers.map((item) => item.driver),
      datasets: [
        {
          label: 'Estatus de Llegada',
          data: data.arrivalStatusDrivers.map((item) => item[selectedAction]),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: getBackgroundColors(
            data.arrivalStatusDrivers.length,
          ),
          borderColor: getBorderColors(data.arrivalStatusDrivers.length),
        },
      ],
    };

    setChartData(chartData);
  }, [data, selectedAction]);

  return (
    <ChartCard
      title={`Llegadas ${
        selectedAction === 'arrivalLate' ? 'Tarde' : 'temprano'
      } ${monthYearName}`}
      isLoading={isLoading && !chartData}
      customHeight="70rem"
      actions={actions}
      downloadFn={() => toExcel.exportData(data?.arrivalStatusDrivers || [])}
    >
      {chartData && <Bar data={chartData} options={options} />}
    </ChartCard>
  );
};

const exportConf: ExportConfig<ArrivalStatusDriver> = {
  fileName: `Llegadas tarde`,
  withDate: true,
  sheetName: 'Llegadas tarde',
  columns: [
    { accessorFn: (data) => data.driver, header: 'Operador' },
    { accessorFn: (data) => data.arrivalEarly, header: 'Temprano' },
    {
      accessorFn: (data) => data.arrivalLate,
      header: 'Tarde',
    },
    { accessorFn: (data) => data.noArrivalRecorded, header: 'Sin informacion' },
  ],
};

const toExcel = new ExportToExcel(exportConf);

